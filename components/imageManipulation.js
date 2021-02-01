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
    results: [],
    inputFile: {
        data: null,
        height: 30,
        width: 100
    },
    exportStatus: {
        start : null,
        end : null,
        delta: null
    }
}

export const ImageManipulationContext = React.createContext(initialValue);

function getCanvasAdnImageWithImage(image, channelHeight) {
    const canvas = document.createElement('canvas')

    canvas.width = CHANNEL_BANNER_WIDTH;
    canvas.height = channelHeight;

    const img = new Image();
    img.src = image;

    // TODO: This should probably be asynchronous
    return [canvas, img];
}

function getClippedRegion(canvas, img, x, y, width, height, channelHeight) {
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, x, y, width, height, 0, 0, CHANNEL_BANNER_WIDTH, channelHeight);

    return canvas.toDataURL();
}

export const getSlicesCount = (width, height, channelHeight) => {
    const sizeRatio = width / CHANNEL_BANNER_WIDTH;
    return ~~(height / (channelHeight * sizeRatio))
}

const generateImages = (inputFile, options, cb) => {
    const channelHeight = options.ignoreSpacing ? CHANNEL_HEIGHT : CHANNEL_BANNER_HEIGHT;

    const sizeRatio = inputFile.width / CHANNEL_BANNER_WIDTH;

    const slicesCount = getSlicesCount(inputFile.width, inputFile.height, channelHeight)

    const [canvas, image] = getCanvasAdnImageWithImage(inputFile.data, channelHeight);

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

const THROTTLE_TIME = 100;

const debouncedGenerateImage = throttle(generateImages, THROTTLE_TIME);

const ImageManipulation = ({children}) => {
    const [results, setResults] = useState(initialValue.results);
    const [options, setOptions] = useState(initialValue.options);
    const [inputFile, setInputFile] = useState(initialValue.inputFile);
    const [exportStatus, setExportStatus] = useState(initialValue.exportStatus);

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

    useEffect(() => {
        const slices = getSlicesCount(inputFile.width, inputFile.height,
            options.ignoreSpacing ? CHANNEL_HEIGHT : CHANNEL_BANNER_HEIGHT);
        setOptions((o) => ({...o, slices, yOffset: 0 }))
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
