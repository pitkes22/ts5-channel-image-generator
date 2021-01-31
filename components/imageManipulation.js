import React, {useState, useCallback, useEffect} from 'react';
import {debounce} from "lodash";

const CHANNEL_HEIGHT = 22;
const CHANNEL_BANNER_HEIGHT = 50;
const CHANNEL_BANNER_WIDTH = 500;

const initialValue = {
    options: {
        x: 0,
        y: 0,
        width: CHANNEL_BANNER_WIDTH,
        height: CHANNEL_BANNER_HEIGHT,
        slices: 5,
        yOffset: 0
    },
    results: [],
    inputFile: {
        data: null,
        height: 100,
        width: 100
    }
}

export const ImageManipulationContext = React.createContext(initialValue);

function getClippedRegion(image, x, y, width, height) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = CHANNEL_BANNER_WIDTH;
    canvas.height = CHANNEL_BANNER_HEIGHT;

    const img = new Image();
    img.src = image;

    //                   source region         dest. region
    ctx.drawImage(img, x, y, width, height, 0, 0, CHANNEL_BANNER_WIDTH, CHANNEL_BANNER_HEIGHT);

    return canvas.toDataURL();
}

const generateImages = (inputFile, options, cb) => {
    console.log('Generuje');
    const result = [];
    for (let i = 0; i < (inputFile.height / CHANNEL_BANNER_HEIGHT); i++) {
        result.push(getClippedRegion(inputFile.data, options.x, options.y + (i * CHANNEL_BANNER_HEIGHT), options.width, options.height))
        // Tu treba spocitat vysku ako primu umerui k tomu ako sa zmenila druha os na 500px
    }
    cb(result);
}

const debouncedGenerateImage = debounce(generateImages, 500);

const ImageManipulation = ({children}) => {
    const [results, setResults] = useState(initialValue.results);
    const [options, setOptions] = useState(initialValue.options);
    const [inputFile, setInputFile] = useState(initialValue.inputFile);

    useEffect(() => {
        debouncedGenerateImage(inputFile, options, (results) => setResults(results));
    }, [inputFile, options])

    const value = {
        results,
        options,
        setOptions,
        inputFile,
        setInputFile
    }

    return (
        <ImageManipulationContext.Provider value={value}>
            {children}
        </ImageManipulationContext.Provider>
    );
}


export default ImageManipulation;
