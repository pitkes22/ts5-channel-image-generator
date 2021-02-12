import React, {useContext, useEffect} from 'react';
import Step from "./step";
import {CHANNEL_BANNER_WIDTH, getRoomsHeight, getSlicesCount, ImageManipulationContext} from "./imageManipulation";
import {Button, FormGroup, Slider, Switch} from "@blueprintjs/core";
import styled from 'styled-components';

const OptionsStep = styled(Step)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
  min-width: 300px;
`

const Options = () => {
    const {options, setOptions, inputFile, rooms} = useContext(ImageManipulationContext);

    const sizeRatio = inputFile.width / CHANNEL_BANNER_WIDTH;

    const maxChannels = getSlicesCount(inputFile.width, inputFile.height, rooms, options.ignoreSpacing);
    const maxVerticalOffset = inputFile.height - getRoomsHeight(inputFile.width, inputFile.height, rooms, options.ignoreSpacing, options.slices);

    const disabled = inputFile.data == null;

    // When options are change check if current values are still valid and if not calculate new values for them
    useEffect(() => {
        if (options.slices > maxChannels) {
            setOption('slices', maxChannels);
        }

        if (options.yOffset > maxVerticalOffset) {
            setOption('yOffset', Math.min(options.yOffset, maxVerticalOffset));
        }

        if (options.yOffset < 0) {
            setOption('yOffset', 0);
        }
    }, [options.slices, options.ignoreSpacing, maxChannels]);

    const setOption = (optionName, value) => setOptions((opt) => ({...opt, [optionName]: value}));

    return (
        <OptionsStep number={2}>
            <Col>
                <FormGroup
                    label="Channels"
                    labelInfo={"(Number of output images)"}
                    helperText="Number of channels you want the banner to be displayed over"
                    disabled={disabled}
                >
                    <Slider
                        min={1}
                        max={maxChannels}
                        stepSize={1}
                        labelStepSize={Math.max(1, maxChannels / 10)}
                        onChange={(value) => setOption('slices', value)}
                        value={options.slices}
                        disabled={disabled}
                    />
                </FormGroup>

                <FormGroup
                    label="Vertical offset"
                    labelInfo={"(Moves image up and down)"}
                    helperText="Chose position of the image. You can get more freedom by setting lower number of channels"
                    disabled={disabled || maxVerticalOffset === 0}
                >
                    <Slider
                        min={0}
                        max={Math.max(1, maxVerticalOffset)}
                        stepSize={1}
                        labelStepSize={Math.max(1, ~~(maxVerticalOffset / 10))}
                        onChange={(value) => setOption('yOffset', value)}
                        value={options.yOffset}
                        disabled={disabled || maxVerticalOffset === 0}
                    />
                </FormGroup>
            </Col>
            <Col>
                <FormGroup
                    label="Ignore channels spacing"
                    labelInfo={"(Space between channels)"}
                    helperText="If checked image will be vertically stretch but all parts of it will be visible"
                    disabled={disabled}
                >
                    <Switch
                        checked={options.ignoreSpacing}
                        label="Ignore spacing"
                        onChange={(value) => {
                            setOption('ignoreSpacing', !options.ignoreSpacing);
                        }}
                        disabled={disabled}
                        large={true}
                    />
                </FormGroup>
                <FormGroup
                    labelFor={'none'}
                    label="Horizontal offset"
                    labelInfo={<>
                        (Moves image right and left) <Button
                            icon={'reset'}
                            small={true}
                            outlined={true}
                            onClick={() => setOption('xOffset', 0)}
                        >Reset</Button>
                    </>}
                    helperText="Horizontal offset of the image. Primarily useful for images with transparent background."
                    disabled={disabled}
                >
                    <Slider
                        showTrackFill={options.xOffset !== 0}
                        min={-inputFile.width}
                        max={inputFile.width}
                        stepSize={inputFile.width / 100}
                        labelStepSize={inputFile.width / 5}
                        onChange={(value) => setOption('xOffset', value)}
                        value={options.xOffset}
                        disabled={disabled}
                    />
                </FormGroup>
            </Col>
        </OptionsStep>
    );
};

export default Options;
