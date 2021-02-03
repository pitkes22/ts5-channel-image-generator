import React, {useContext, useState} from 'react';
import Step from "./step";
import {Button, Callout, Code, FileInput, FormGroup, Icon, InputGroup} from "@blueprintjs/core";
import styled from 'styled-components';
import {CHANNEL_BANNER_WIDTH, ImageManipulationContext} from "./imageManipulation";
import {toaster} from "../pages";

const ImagePreview = styled.img`
  width: 300px;
  object-fit: contain;
  border: 1px solid rgb(255 255 255 / 20%);
`

const ImagePreviewPlaceholder = styled.div`
  height: 250px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(0 0 0 / 20%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 5px;
`

const UploadStep = styled(Step)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-start;
`

const Col = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: ${props => props.$width ?? 30};
  min-width: 330px;
`

const FileSupportCallout = styled(Callout)`
  min-width: 100%;
  margin-bottom: 2rem;
`

const LoadButton = styled(Button)`
  width: 85px;
`

const loadCrossOriginImage = (src) => {
    return new Promise(((resolve, reject) => {
        const imageElement = document.createElement('img');
        imageElement.onload = resolve;
        imageElement.onerror = reject;
        imageElement.src = src;
    }))
}

const Upload = () => {
    const {inputFile, setInputFile} = useContext(ImageManipulationContext);
    const [loadUrl, setLoadUrl] = useState("");
    const [isUrlLoading, setIsUrlLoading] = useState(false);

    /**
     * Converts File blob to Data URL
     *
     * @param file Blob
     * @return {Promise<unknown>}
     */
    const fileToDataURL = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result)
            }
            reader.readAsDataURL(file);
        })
    }

    /**
     * Resizes image to maxWidth specified by value of CHANNEL_BANNER_WIDTH constant. This is done to scale done image
     * to the maximum useful resolution at the beginning to prevent unnecessary work when working with big images.
     *
     * @param url URL of the image to be scaled down
     * @param metadata Metadata of the image
     * @return {Promise<unknown>}
     */
    const resizeImageFromDataURL = async (url, metadata) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d');

            canvas.width = CHANNEL_BANNER_WIDTH;
            canvas.height = metadata.height * (CHANNEL_BANNER_WIDTH / metadata.width);

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
     * Export metadata (width, height) from the image specified by URL
     *
     * @param url URL of the image
     * @return {Promise<unknown>}
     */
    const getImageMetadataFromDataURL = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onerror = reject
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                })
            }
            // img.crossOrigin = "Anonymous"
            img.src = url;
        })
    }

    /**
     * Handles uploading of the image using file input form
     *
     * @param e Input change event
     * @return {Promise<void>}
     */
    const uploadHandler = async (e) => {
        const file = e.target.files[0];

        if (file == null) return;

        const dataURL = await fileToDataURL(file);

        const sourceImageMetadata = await getImageMetadataFromDataURL(dataURL);

        const resizedImageDataURL = await resizeImageFromDataURL(dataURL, sourceImageMetadata);

        const metadata = await getImageMetadataFromDataURL(resizedImageDataURL);

        setInputFile({
            data: resizedImageDataURL,
            width: metadata.width,
            height: metadata.height,
            name: file.name
        })
    }

    /**
     * Handles loading of image from the given URL
     *
     * @return {Promise<void>}
     */
    const loadHandler = async () => {
        setIsUrlLoading(true);

        try {
            // Tries to load image using fetch to get network error (primarily need to catch CORS events) that can be
            // caught because when loading fails inside canvas it does not produce Exception.
            await fetch(loadUrl);

            // TODO: Instead of fetched image from the internet two times data from first fetch should be encoded to
            //  base64URL and then used to process image

            const sourceImageMetadata = await getImageMetadataFromDataURL(loadUrl);

            const resizedImageDataURL = await resizeImageFromDataURL(loadUrl, sourceImageMetadata);

            const metadata = await getImageMetadataFromDataURL(resizedImageDataURL);

            setIsUrlLoading(false);
            setInputFile({
                data: resizedImageDataURL,
                width: metadata.width,
                height: metadata.height,
                name: "loaded"
            })
        } catch (e) {
            console.error(e);

            // When error occurs when loading image from url we will try to load it again using HTML img element.
            // If this second attempt work we can be pretty sure that issue is in the CORS and we can show appropriate
            // error message to the user.
            try {
                await loadCrossOriginImage(loadUrl);
                toaster.show({
                    intent: "danger",
                    message: <>It seems that site that you are trying to load images from does not allow images to be
                        accessed by other sites.
                        Plese download the image a upload it manually. If you are site administrator you can get <a
                            href={'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'}>more information
                            here</a>.</>,
                    icon: "error"
                })
            } catch (x) {
                toaster.show({
                    intent: "danger",
                    message: <>Unable to load image from URL. Plese check if this is a valid url to image, local address
                        such as <code>file://</code> or <code>C://</code> will not work.</>,
                    icon: "error"
                })
            }
            setIsUrlLoading(false);
        }
    }

    return (
        <UploadStep number={1}>
            <Col $width={'calc(100% - 350px)'}>
                <FileSupportCallout intent={"primary"} title={"Supported image formats"}>
                    Image formats that are supported depends on your browser but in general all modern image formats
                    should work fine.
                    Animated banners are not yet supported and they will be converted to static one.
                    Output images are in resolution <Code>500x22</Code> pixels so optimal size for the input image is
                    width <Code>500px</Code> and height that can be divided evenly.
                </FileSupportCallout>
                <Col $width={'50%'}>
                    <FormGroup
                        label="Image File"
                        helperText={<>Upload image that you would like to convert into room banners.<br/>Images are not
                            uploaded to the server and all processing is done in the browser.</>}
                        labelFor="file-input"
                        labelInfo="(Upload from your computer)"
                    >
                        <FileInput
                            style={{width: 330}}
                            fill={true}
                            inputProps={{
                                accept: 'image/*'
                            }}
                            id={'file-input'}
                            text={inputFile.name ?? 'Choose file...'}
                            onInputChange={uploadHandler}
                            large={true}
                        />
                    </FormGroup>
                </Col>
                <Col $width={'50%'}>
                    <FormGroup
                        label="Image URL"
                        helperText="Load image from public URL"
                        labelFor="file-url"
                        labelInfo="(Load from the internet)"
                    >
                        <InputGroup
                            style={{width: 330}}
                            large={true}
                            fill={true}
                            onChange={(e) => {
                                setLoadUrl(e.target.value)
                            }}
                            placeholder="Image URL..."
                            rightElement={<LoadButton
                                loading={isUrlLoading}
                                large={true}
                                onClick={loadHandler}
                                disabled={loadUrl.length === 0}
                            >Load</LoadButton>}
                            value={loadUrl}
                        />
                    </FormGroup>
                </Col>
            </Col>
            <Col $width={'250px'} style={{justifyContent: 'flex-end'}}>
                {inputFile.data ? <ImagePreview src={inputFile.data} alt="Image Preview"/> :
                    <ImagePreviewPlaceholder><Icon icon={"media"} iconSize={50}/></ImagePreviewPlaceholder>}
            </Col>
        </UploadStep>
    );
};

export default Upload;
