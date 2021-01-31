import React, {useContext} from 'react';
import Step from "./step";
import {ImageManipulationContext} from "./imageManipulation";
import {FormGroup, Slider} from "@blueprintjs/core";

const Options = () => {
    const {options, setOptions, inputFile} = useContext(ImageManipulationContext);

    const setOption = (optionName, value) => setOptions((opt) => ({...opt, [optionName]: value}));

    return (
        <Step number={2}>
            <FormGroup
                label="X"
                helperText="TODO"
            >
                <Slider
                    min={0}
                    max={inputFile.width}
                    stepSize={1}
                    labelStepSize={~~(inputFile.width / 10)}
                    onChange={(value) => setOption('x', value)}
                    value={options.x}
                />
            </FormGroup>

            <FormGroup
                label="Y"
                helperText="TODO"
            >
                <Slider
                    min={0}
                    max={inputFile.height}
                    stepSize={1}
                    labelStepSize={~~(inputFile.height / 10)}
                    onChange={(value) => setOption('y', value)}
                    value={options.y}
                />
            </FormGroup>

            <FormGroup
                label="width"
                helperText="TODO"
            >
                <Slider
                    min={0}
                    max={inputFile.width}
                    stepSize={1}
                    labelStepSize={~~(inputFile.width / 10)}
                    onChange={(value) => setOption('width', value)}
                    value={options.width}
                />
            </FormGroup>

            <FormGroup
                label="height"
                helperText="TODO"
            >
                <Slider
                    min={0}
                    max={inputFile.height}
                    stepSize={1}
                    labelStepSize={~~(inputFile.height / 10)}
                    onChange={(value) => setOption('height', value)}
                    value={options.height}
                />
            </FormGroup>

        </Step>
    );
};

export default Options;
