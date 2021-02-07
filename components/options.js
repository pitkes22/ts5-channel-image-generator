import React, {useContext, useEffect} from 'react';
import Step from "./step";
import {CHANNEL_BANNER_HEIGHT, CHANNEL_HEIGHT, getSlicesCount, ImageManipulationContext} from "./imageManipulation";
import {FormGroup, Slider, Switch, Button, ButtonGroup} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';

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
    const {options, setOptions, inputFile} = useContext(ImageManipulationContext);
    const channelHeight = options.ignoreSpacing ? CHANNEL_HEIGHT : CHANNEL_BANNER_HEIGHT;

    const maxChannels = getSlicesCount(inputFile.width, inputFile.height, channelHeight);
    const maxVerticalOffset = inputFile.height - options.slices * channelHeight;

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
                        min={0}
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
                    disabled={disabled}
                >
                    <Slider
                        min={0}
                        max={maxVerticalOffset}
                        stepSize={1}
                        labelStepSize={~~(inputFile.height / 10)}
                        onChange={(value) => setOption('yOffset', value)}
                        value={options.yOffset}
                        disabled={disabled}
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
                    label="Custom background color"
                    labelInfo={"(only applys to transparent images)"}
                    helperText="Add your own custom background to transparent images"
                    disabled={disabled}
                >
                    <ButtonGroup>
                        <Popover2
                            disabled={disabled}
                            placement="top"
                            hasBackdrop={true}
                            minimal={false}
                            content={
                            <ChromePicker
                                color={ options.backgroundColor }
                                onChange={ (color) => {setOption('backgroundColor', color.rgb)} }
                            />
                          }
                        >
                            <Button
                                text="Color Picker"
                                disabled={disabled}
                                onClick={() => {
                                    if (!options.backgroundColor)
                                        setOption('backgroundColor', {r: 255, g: 255, b: 255, a: 1})
                                }}
                            />
                        </Popover2>
                        <Button
                            text="Remove"
                            disabled={disabled}
                            onClick={() => { setOption('backgroundColor', null) }}
                        />
                    </ButtonGroup>
                </FormGroup>
            </Col>
        </OptionsStep>
    );
};

export default Options;
