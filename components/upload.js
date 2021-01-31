import React from 'react';
import Step from "./step";
import {FileInput, FormGroup} from "@blueprintjs/core";
import {useState, useContext} from "react";
import styled from 'styled-components';
import {ImageManipulationContext} from "./imageManipulation";

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
                    onInputChange={(e) => {
                        const reader = new FileReader();
                        const file = e.target.files[0];

                        reader.onload = (e) => {
                            const img = new Image();

                            img.onload = () => {
                                setInputFile({
                                    data: e.target.result,
                                    width: img.width,
                                    height: img.height,
                                    name: file.name
                                })
                            }
                            img.src = e.target.result;
                        }

                        reader.readAsDataURL(file);
                    }}
                    large={true}
                />
            </FormGroup>

            {inputFile.data && <ImagePreview src={inputFile.data} alt="Image Preview"/>}
        </UploadStep>
    );
};

export default Upload;
