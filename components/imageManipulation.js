import React, {useEffect, useState} from 'react';
import {throttle} from "lodash";

export const SPACER_HEIGHT = 16;
export const SPACER_BANNER_HEIGHT = 26;
export const CHANNEL_HEIGHT = 22;
export const CHANNEL_BANNER_HEIGHT = 30;
export const CHANNEL_BANNER_WIDTH = 500;
export const CHANNEL_DEPTH_OFFSET = 11;

const defaultRoom = {depth: 0, spacer: false};

const initialValue = {
    options: {
        slices: 1,
        yOffset: 0,
        xOffset: 0,
        ignoreSpacing: false
    },
    results: [null, null, null, null, null],  // By default show 5 rooms without image
    rooms: new Array(256).fill(defaultRoom), // TODO: This creates arbitrary limit of maximum image size to 256 slices
    inputFile: {
        data: null,
        height: 30,
        width: 100
    },
    exportStatus: {
        start: null,
        end: null,
        delta: null
    }
}

export const ImageManipulationContext = React.createContext(initialValue);

/**
 * Returns height of the channel based on channel type and options
 *
 * @param isSpacer
 * @param ignoreSpacing
 * @return {number}
 */
const getChannelHeight = (isSpacer, ignoreSpacing) => isSpacer
    ? ignoreSpacing ? SPACER_HEIGHT : SPACER_BANNER_HEIGHT
    : ignoreSpacing ? CHANNEL_HEIGHT : CHANNEL_BANNER_HEIGHT

/**
 * Creates HTML canvas of given size
 *
 * @return {HTMLCanvasElement}
 */
const getCanvas = () => {
    if (typeof document === "undefined") return;

    const canvas = document.createElement('canvas')

    canvas.width = 0;
    canvas.height = 0;

    return canvas;
}

/**
 * Creates new image object and loads the image provided by url
 *
 * @param url Url to the image (can ba base64 data url)
 * @return {Promise<unknown>}
 */
const getImage = async (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onerror = reject
        img.onload = () => {
            resolve(img)
        }
        img.src = url;
    })
}

/**
 * Renders image on canvas in given position and returns base64 encoded image of the visible area.
 *
 * @param canvas Canvas to render image on
 * @param img Image Object that will be rendered
 * @param x Horizontal position
 * @param y Vertical position
 * @param width Width of the source image
 * @param height height of the source image
 * @param channelHeight Output height of the image
 * @return {string} Base64 encoded image (DataURL)
 */
const getClippedRegion = (canvas, img, x, y, width, height, channelHeight) => {
    canvas.width = CHANNEL_BANNER_WIDTH;
    canvas.height = channelHeight;

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, CHANNEL_BANNER_WIDTH, channelHeight);
    ctx.drawImage(img, x, y, width, height, 0, 0, CHANNEL_BANNER_WIDTH, channelHeight);

    return canvas.toDataURL();
};

/**
 * Returns maximum amount of slices that image can be sliced to
 *
 * @param width Width of the source image
 * @param height height of the source image
 * @param rooms Array of room objects
 * @param ignoreSpacing If true calculation will ignore channel spacing
 * @return {number} Number of slices
 */
export const getSlicesCount = (width, height, rooms, ignoreSpacing) => {
    let count = 0;
    let remainingHeight = height;

    const sizeRatio = width / CHANNEL_BANNER_WIDTH;

    for (const room of rooms) {
        const channelHeight = getChannelHeight(room.spacer, ignoreSpacing) * sizeRatio;
        if (remainingHeight - channelHeight < 0) break;
        remainingHeight -= channelHeight;
        count++;
    }

    return count;
}

/**
 * Returns total height of the all channels
 *
 * @param width
 * @param height
 * @param rooms
 * @param ignoreSpacing
 * @return {*}
 */
export const getRoomsHeight = (width, height, rooms, ignoreSpacing) => {
    const sizeRatio = width / CHANNEL_BANNER_WIDTH;
    return rooms.reduce((acc, room) => acc + getChannelHeight(room.spacer, ignoreSpacing) * sizeRatio)
}

/**
 * Generates slices of the inputFile image based on the given options
 *
 * @param inputFile Input file object containing base64URL encoded image data and image metadata (width, height, name)
 * @param options Options object providing values like number of output slices, height of the slice and vertical offset
 * @param canvas Canvas Object to be used for image rendering
 * @param image Reference to image object that contains image to render
 * @param rooms Reference to rooms data from preview
 * @param cb
 */
const generateImages = (inputFile, options, canvas, image, rooms, cb) => {
    const sizeRatio = inputFile.width / CHANNEL_BANNER_WIDTH;

    const slicesCount = getSlicesCount(inputFile.width, inputFile.height, rooms, options.ignoreSpacing)

    const result = [];
    let y = 0;
    for (let i = 0; i < (options.slices - 1); i++) {
        const room = rooms[i];
        const xOffset = room.depth * CHANNEL_DEPTH_OFFSET;

        const channelHeight = getChannelHeight(room.spacer, options.ignoreSpacing);

        result.push(getClippedRegion(
            canvas, image,
            xOffset + options.xOffset, options.yOffset + y,
            inputFile.width, inputFile.height / slicesCount,
            channelHeight)
        )

        y += channelHeight;
    }
    cb(result);
}

// Throttle time of the generateImage function. Should be approximately same as average time that it takes process average image.
const THROTTLE_TIME = 50;

/**
 * Throttled (Using lodash throttle) generateImage function that is used to prevent generating unnecessarily to many
 * images when changing options using UI
 *
 * @type {DebouncedFunc<generateImages>}
 */
const debouncedGenerateImage = throttle(generateImages, THROTTLE_TIME);

const ImageManipulation = ({children}) => {
    const [results, setResults] = useState(initialValue.results);
    const [options, setOptions] = useState(initialValue.options);
    const [inputFile, setInputFile] = useState(initialValue.inputFile);
    const [exportStatus, setExportStatus] = useState(initialValue.exportStatus);
    const [rooms, setRooms] = useState(initialValue.rooms);
    const [image, setImage] = useState();

    const [canvas, _] = useState(getCanvas())

    // When input file is changed loads new image into canvas
    useEffect(() => {
        (async () => {
                if (inputFile.data == null) return;
                setImage(await getImage(inputFile.data));
            }
        )();
    }, [inputFile])


    // When inputFile or options are changed it generates new result images
    useEffect(() => {
        (async () => {
                if (inputFile.data == null || image == null) return;

                const start = Date.now();
                setExportStatus((c) => ({...c, start: start, end: null}));

                debouncedGenerateImage(inputFile, options, canvas, image, rooms, (results) => {
                    setResults(results);
                    const end = Date.now();
                    setExportStatus((c) => ({...c, end: end, delta: end - start}));
                });
            }
        )();
    }, [image, options, rooms])

    // When input file is changed it recalculates maxSlicesCount and resets yOffset option
    useEffect(() => {
        const slices = getSlicesCount(inputFile.width, inputFile.height, rooms, options.ignoreSpacing);
        setOptions((o) => ({...o, slices, yOffset: 0, xOffset: 0}))
    }, [inputFile])

    const value = {
        results,
        options,
        setOptions,
        inputFile,
        setInputFile,
        exportStatus,
        setExportStatus,
        rooms,
        setRooms
    }

    return (
        <ImageManipulationContext.Provider value={value}>
            {children}
        </ImageManipulationContext.Provider>
    );
}


export default ImageManipulation;
