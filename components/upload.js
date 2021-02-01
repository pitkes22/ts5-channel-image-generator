import React from 'react';
import Step from "./step";
import {FileInput, FormGroup} from "@blueprintjs/core";
import {useState, useContext} from "react";
import styled from 'styled-components';
import {CHANNEL_BANNER_HEIGHT, CHANNEL_BANNER_WIDTH, ImageManipulationContext} from "./imageManipulation";

const ImagePreview = styled.img`
  height: 250px;
  width: auto;
`

const UploadStep = styled(Step)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Upload = () => {
    const {inputFile, setInputFile} = useContext(ImageManipulationContext);

    const fileToDataURL = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result)
            }
            reader.readAsDataURL(file);
        })
    }

    const resizeImageFromDataURL = (url, metadata) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');

        canvas.width = 500;
        canvas.height = metadata.height * (CHANNEL_BANNER_WIDTH / metadata.width);

        console.log('height', metadata.width, metadata.height, canvas.width, canvas.height);

        const img = new Image();
        img.src = url;

        ctx.drawImage(img, 0, 0, metadata.width, metadata.height, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL();
    }

    const getImageMetadataFromDataURL = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                })
            }
            img.src = url;
        })
    }

    const uploadHandler = async (e) => {
        const file = e.target.files[0];

        const dataURL = await fileToDataURL(file);

        const sourceImageMetadata = await getImageMetadataFromDataURL(dataURL);

        const resizedImageDataURL = resizeImageFromDataURL(dataURL, sourceImageMetadata);

        const metadata = await getImageMetadataFromDataURL(resizedImageDataURL);

        setInputFile({
            data: resizedImageDataURL,
            width: metadata.width,
            height: metadata.height,
            name: file.name
        })
    }

    return (
        <UploadStep number={1}>
            <FormGroup
                label="Image File"
                helperText="Upload image that you would like to convert into room banners"
                labelFor="file-input"
                labelInfo="(required)"
            >
                <FileInput
                    inputProps={{
                        accept: 'image/*'
                    }}
                    id={'file-input'}
                    text={inputFile.name ?? 'Choose file...'}
                    onInputChange={uploadHandler}
                    large={true}
                />
            </FormGroup>

            {inputFile.data && <ImagePreview src={inputFile.data} alt="Image Preview"/>}
        </UploadStep>
    );
};

export default Upload;
