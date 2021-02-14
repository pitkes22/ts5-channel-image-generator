import React, {useEffect, useState} from 'react';
import {throttle} from "lodash";
import {getImageMetadataFromDataURL} from "./upload";

export const SPACER_HEIGHT = 16;
export const SPACER_BANNER_HEIGHT = 26;
export const CHANNEL_HEIGHT = 22;
export const CHANNEL_BANNER_HEIGHT = 30;
export const CHANNEL_BANNER_WIDTH = 500;
export const CHANNEL_DEPTH_OFFSET = 11;

export const defaultRoom = {depth: 0, spacer: false};

const initialValue = {
    options: {
        slices: 1,
        yOffset: 0,
        xOffset: 0,
        ignoreSpacing: false,
        coverFitMode: true,
    },
    results: [null, null, null, null, null],  // By default show 5 rooms without image
    rooms: new Array(256).fill(defaultRoom), // TODO: This creates arbitrary limit of maximum image size to 256 slices
    sourceImage: {
        data: null,
        name: null,
        height: 30,
        width: 100
    },
    image: {
        data: null,
        name: null,
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
 * Resizes image to maxWidth specified by the parameter.
 *
 * @param url URL of the image to be scaled down
 * @param metadata Metadata of the image
 * @param width Target max width of the result image
 * @return {Promise<unknown>}
 */
export const resizeImageFromDataURL = async (url, metadata, width) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = metadata.height * (width / metadata.width);

        const img = new Image();

        img.crossOrigin = "Anonymous"
        img.onload = () => {
            ctx.drawImage(img, 0, 0, metadata.width, metadata.height, 0, 0, canvas.width, canvas.height);

            resolve(canvas.toDataURL());
        }

        img.src = url;
    })
}

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

    const sizeRatio = width / CHANNEL_BANNER_WIDTH;

    let remainingHeight = height * sizeRatio;

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
 * @param width Width of the source image
 * @param height height of the source image
 * @param rooms Array of room objects
 * @param ignoreSpacing If true calculation will ignore channel spacing
 * @param channelsCount Maximum count of the channels (needed to prevent counting placeholder channels)
 * @return {*}
 */
export const getRoomsHeight = (width, height, rooms, ignoreSpacing, channelsCount) => {
    const slicesCount = getSlicesCount(width, height, rooms, ignoreSpacing);
    const sizeRatio = width / CHANNEL_BANNER_WIDTH;
    return rooms.reduce((acc, room, i) => {
        if (i > slicesCount - 1) return acc;
        if (channelsCount != null && i >= channelsCount) return acc;
        return acc + (getChannelHeight(room.spacer, ignoreSpacing) * sizeRatio);
    }, 0);
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
    for (let i = 0; i < options.slices; i++) {
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
    const [sourceImage, setSourceImage] = useState(initialValue.sourceImage);
    const [rooms, setRooms] = useState(initialValue.rooms);
    const [results, setResults] = useState(initialValue.results);
    const [options, setOptions] = useState(initialValue.options);
    const [image, setImage] = useState(initialValue.image);
    const [exportStatus, setExportStatus] = useState(initialValue.exportStatus);
    const [imageObject, setImageObject] = useState();

    const [canvas, _] = useState(getCanvas())

    // When source image is changed loads new imageObject into canvas
    useEffect(() => {
        (async () => {
                if (sourceImage.data == null) return;


                const resizedImage = await resizeImageFromDataURL(
                    sourceImage.data,
                    {width: sourceImage.width, height: sourceImage.height},
                    500
                );

                const resizedImageMetadata = await getImageMetadataFromDataURL(resizedImage)

                setImage({
                    data: resizedImage,
                    width: resizedImageMetadata.width,
                    height: resizedImageMetadata.height,
                    name: sourceImage.name
                });
                setImageObject(await getImage(resizedImage));
            }
        )();
    }, [sourceImage])

    // When inputFile or options are changed it generates new result images
    useEffect(() => {
        (async () => {
                if (imageObject == null) return;

                const start = Date.now();
                setExportStatus((c) => ({...c, start: start, end: null}));

                debouncedGenerateImage(image, options, canvas, imageObject, rooms, (results) => {
                    setResults(results);
                    const end = Date.now();
                    setExportStatus((c) => ({...c, end: end, delta: end - start}));
                });
            }
        )();
    }, [imageObject, options, rooms])

    // When input file is changed it recalculates maxSlicesCount and resets yOffset option
    useEffect(() => {
        const slices = getSlicesCount(image.width, image.height, rooms, options.ignoreSpacing);
        setOptions((o) => ({...o, slices, yOffset: 0, xOffset: 0}))
    }, [image])

    const value = {
        results,
        options,
        setOptions,
        image,
        setImage,
        exportStatus,
        setExportStatus,
        sourceImage,
        setSourceImage,
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