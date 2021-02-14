import React, {useContext, useEffect, useState} from 'react';
import Step from "./step";
import {ImageManipulationContext} from "./imageManipulation";
import {Button, Code, FormGroup, InputGroup, ProgressBar} from "@blueprintjs/core";
import * as JSZip from "jszip";
import {saveAs} from "file-saver";

const Export = () => {
    const {exportStatus, results, sourceImage} = useContext(ImageManipulationContext);
    const [fileNamePrefix, setFileNamePrefix] = useState('');
    const [exportProgress, setExportProgress] = useState(null);
    const [exportTimeDelta, setExportTimeDelta] = useState(null);

    const isGeneratingPreview = (exportStatus.end == null || exportStatus.start == null);
    const isExporting = exportProgress != null && exportProgress !== 1;

    const previewTimeDeltaStr = exportStatus.delta == null ? 'N/A' : `${exportStatus.delta}ms`;
    const exportTimeDeltaStr = exportTimeDelta == null ? 'N/A' : `${exportTimeDelta}ms`;

    const disabled = sourceImage.data == null;

    // When new results are generated invalidates current export
    useEffect(() => {
        setExportProgress(null);
    }, [results])

    /**
     * Creates ZIP file with result images in /images folder and /files.txt file that contains names of all images in
     * images folder. If file name prefix is specified images are prefixed with it (`prefix_%d.png`) otherwise
     * `%d.png` file name is used.
     *
     * @return {Promise<void>}
     */
    const exportToZip = async () => {
        const start = Date.now();
        setExportProgress(0.1);
        const zip = new JSZip();
        let filesTxt = '';

        const imagesFolder = zip.folder("images");

        results.forEach((result, i) => {
            const base64Data = result.replace(/^data:image\/(png|jpg);base64,/, "");

            const fileName = `${fileNamePrefix}${fileNamePrefix.length > 0 ? '_' : ''}${i}.png`;

            imagesFolder.file(fileName, base64Data, {base64: true});
            filesTxt += `${fileName}\n`;
        })

        setExportProgress(0.5);

        zip.file("files.txt", filesTxt);

        const blob = await zip.generateAsync({type: "blob"})

        setExportProgress(0.8);

        saveAs(blob, `ts5_channel_banner_${sourceImage.name}.zip`)

        setExportProgress(1);
        setExportTimeDelta(Date.now() - start);
    }

    return (
        <Step number={3}>
            <FormGroup
                label="Generating preview"
                labelInfo={"(Status of preview you see on the right)"}
                helperText={<>Last preview render time: <b>{previewTimeDeltaStr}</b></>}
                disabled={disabled}
            >
                <ProgressBar
                    value={disabled ? 0 : !isGeneratingPreview}
                    animate={isGeneratingPreview}
                    disabled={disabled}
                />
            </FormGroup>

            <FormGroup
                label="Exporting to ZIP file"
                labelInfo={"(Status of rendering final images and creating ZIP file)"}
                helperText={<>Last export time: <b>{exportTimeDeltaStr}</b></>}
                disabled={disabled}
            >
                <ProgressBar
                    value={exportProgress == null ? 0 : exportProgress}
                    animate={isExporting}
                    intent={exportProgress === 1 ? "success" : "primary"}
                    disabled={disabled}
                />
            </FormGroup>


            <FormGroup
                label="Image file prefix"
                labelInfo={"(optional)"}
                helperText={<>(File format will be <Code>prefix_%d.png</Code>). Name of all images will be saved to
                    files.txt file for convenience</>}
                disabled={disabled}
            >
                <InputGroup
                    large={false}
                    fill={false}
                    onChange={(e) => {
                        setFileNamePrefix(e.target.value)
                    }}
                    placeholder="File Name Prefix"
                    value={fileNamePrefix}
                    disabled={disabled}
                />
            </FormGroup>

            <Button
                intent={"primary"}
                large={true}
                onClick={exportToZip}
                loading={isExporting}
                disabled={disabled}
                icon={'download'}
            >
                Export and download ZIP file
            </Button>
        </Step>
    );
};

export default Export;
