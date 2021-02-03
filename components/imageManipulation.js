import React, {useEffect, useState} from 'react';
import {throttle} from "lodash";

export const CHANNEL_HEIGHT = 22;
export const CHANNEL_BANNER_HEIGHT = 30;
export const CHANNEL_BANNER_WIDTH = 500;

const initialValue = {
    options: {
        slices: 5,
        yOffset: 0,
        ignoreSpacing: false
    },
    results: [null, null, null, null, null], // By default show 5 rooms without image
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
 * Creates HTML canvas with image and returns reference to both
 *
 * @param image URL of image
 * @param channelHeight height of the canvas (output)
 * @return {(HTMLCanvasElement|HTMLImageElement)[]}
 */
function getCanvasAndImageWithImage(image, channelHeight) {
    const canvas = document.createElement('canvas')

    canvas.width = CHANNEL_BANNER_WIDTH;
    canvas.height = channelHeight;

    const img = new Image();
    img.src = image;

    // TODO: This should probably be asynchronous
    return [canvas, img];
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
function getClippedRegion(canvas, img, x, y, width, height, channelHeight) {
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, CHANNEL_BANNER_WIDTH, channelHeight);
    ctx.drawImage(img, x, y, width, height, 0, 0, CHANNEL_BANNER_WIDTH, channelHeight);

    return canvas.toDataURL();
}

/**
 * Returns maximum amount of slices that image can be sliced to
 *
 * @param width Width of the source image
 * @param height height of the source image
 * @param channelHeight Output height of the image
 * @return {number} Number of slices
 */
export const getSlicesCount = (width, height, channelHeight) => {
    const sizeRatio = width / CHANNEL_BANNER_WIDTH;
    return ~~(height / (channelHeight * sizeRatio))
}

/**
 * Generates slices of the inputFile image based on the given options
 *
 * @param inputFile Input file object containing base64URL encoded image data and image metadata (width, height, name)
 * @param options Options object providing values like number of output slices, height of the slice and vertical offset
 * @param cb Callback that will be called when images are generated (Promise API cant be used because we need to throttle this function)
 */
const generateImages = (inputFile, options, cb) => {
    const channelHeight = options.ignoreSpacing ? CHANNEL_HEIGHT : CHANNEL_BANNER_HEIGHT;

    const sizeRatio = inputFile.width / CHANNEL_BANNER_WIDTH;

    const slicesCount = getSlicesCount(inputFile.width, inputFile.height, channelHeight)

    const [canvas, image] = getCanvasAndImageWithImage(inputFile.data, channelHeight);

    const result = [];
    for (let i = 0; i < options.slices; i++) {
        result.push(getClippedRegion(
            canvas, image,
            0, options.yOffset + (i * (channelHeight * sizeRatio)),
            inputFile.width, inputFile.height / slicesCount,
            channelHeight)
        )
    }
    cb(result);
}

// Throttle time of the generateImage function. Should be approximately same as average time that it takes process average image.
const THROTTLE_TIME = 100;

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

    // When inputFile or options are changed it generates new result images
    useEffect(() => {
        if (inputFile.data == null) return;
        const start = Date.now();
        setExportStatus((c) => ({...c, start: start, end: null}));
        debouncedGenerateImage(inputFile, options, (results) => {
            setResults(results)
            const end = Date.now();
            setExportStatus((c) => ({...c, end: end, delta: end - start}));
        });
    }, [inputFile, options])

    // When input file is changed it recalculates maxSlicesCount and resets yOffset option
    useEffect(() => {
        const slices = getSlicesCount(inputFile.width, inputFile.height,
            options.ignoreSpacing ? CHANNEL_HEIGHT : CHANNEL_BANNER_HEIGHT);
        setOptions((o) => ({...o, slices, yOffset: 0}))
    }, [inputFile])

    const value = {
        results,
        options,
        setOptions,
        inputFile,
        setInputFile,
        exportStatus,
        setExportStatus
    }

    return (
        <ImageManipulationContext.Provider value={value}>
            {children}
        </ImageManipulationContext.Provider>
    );
}


export default ImageManipulation;
