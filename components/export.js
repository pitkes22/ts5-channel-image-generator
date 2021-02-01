import React from 'react';
import Step from "./step";
import {ImageManipulationContext} from "./imageManipulation";
import {useContext} from "react";

const Export = () => {
    const {exportStatus, setExportStatus} = useContext(ImageManipulationContext);

    const timeDelta = (exportStatus.end == null || exportStatus.start == null) ? 'N/A' : `${exportStatus.end - exportStatus.start}ms`

    return (
        <Step number={3}>
            Last build time: <b>{timeDelta}</b>
            <pre>
                {JSON.stringify(exportStatus)}
            </pre>
        </Step>
    );
};

export default Export;
