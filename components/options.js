import React, {useContext, useEffect} from 'react';
import Step from "./step";
import {getRoomsHeight, getSlicesCount, ImageManipulationContext} from "./imageManipulation";
import {Button, ButtonGroup, FormGroup, Icon, Slider, Switch} from "@blueprintjs/core";
import {Popover2} from "@blueprintjs/popover2";
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import styled from 'styled-components';
import {ChromePicker} from 'react-color';
import {clamp} from 'lodash';

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
  min-height: 120px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const ColorPreview = styled.div`
  width: 1.5em;
  height: 1.5em;
  border: 1px solid #fafafa;
`

const HelpPopover = styled(Popover2)`
  .bp3-popover2-content {
    background-color: #2b3346 !important;
  }
`

const ColorPicker = styled(ChromePicker)`
  * {
    color: white !important;
  }

  input {
    background-color: #2b3346 !important;
  }

  &.chrome-picker {
    background-color: #1c2538 !important;
  }

  svg {
    fill: white !important;

    &:hover {
      fill: #2b3346 !important;
    }
  }
`

const Options = () => {
    const {options, setOptions, image, rooms} = useContext(ImageManipulationContext);

    const maxChannels = getSlicesCount(image.width, image.height, rooms, options.ignoreSpacing);
    const maxVerticalOffset = ~~(image.height - getRoomsHeight(image.width, image.height, rooms, options.ignoreSpacing, options.slices));

    const disabled = image.data == null;

    // When options are change check if current values are still valid and if not calculate new values for them
    useEffect(() => {
        if (options.slices > maxChannels) {
            setOption('slices', maxChannels);
        }

        if (options.yOffset > maxVerticalOffset) {
            setOption('yOffset', clamp(options.yOffset, 0, maxVerticalOffset));
        }

        if (options.yOffset < 0) {
            setOption('yOffset', 0);
        }
    }, [options.slices, options.ignoreSpacing, maxChannels]);

    const setOption = (optionName, value) => setOptions((opt) => ({...opt, [optionName]: value}));

    return (
        <OptionsStep number={2}>
            <Row>
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
                </Col>
            </Row>
            <Row>
                <Col>
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
                            min={-image.width}
                            max={image.width}
                            stepSize={image.width / 100}
                            labelStepSize={image.width / 5}
                            onChange={(value) => setOption('xOffset', value)}
                            value={options.xOffset}
                            disabled={disabled}
                        />

                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup
                        label="Fit mode"
                        labelInfo={"(behavior of image when stretch over nested channels)"}
                        helperText="If cover mode is used image will be stretch over nested channels. Otherwise it will be aligned to left with fixed width"
                        disabled={disabled}
                        labelFor={'none'}
                    >
                        <Switch
                            innerLabel={'Contain'}
                            innerLabelChecked={'Cover'}
                            checked={options.coverFitMode}
                            label={<>
                                Image Fit Mode <HelpPopover
                                disabled={disabled}
                                placement="right"
                                interactionKind={'hover'}
                                usePortal={false}
                                content={
                                    <img
                                        src={'coverContainExplanation.png'}
                                        alt={'Cover/Contain explanation'}
                                        style={{width: 350}}
                                    />
                                }
                            >
                                <Icon icon={'info-sign'}/>
                            </HelpPopover>

                            </>}
                            onChange={() => setOption('coverFitMode', !options.coverFitMode)}
                            disabled={disabled}
                            large={true}
                        />
                    </FormGroup>
                </Col>
                <Col>
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
                                    <ColorPicker
                                        color={options.backgroundColor}
                                        onChange={(color) => {
                                            setOption('backgroundColor', color.hex + Math.round(color.rgb.a * 255).toString(16))
                                        }}
                                    />
                                }
                            >
                                <Button
                                    outlined={true}
                                    icon={<ColorPreview style={{backgroundColor: options.backgroundColor}}/>}
                                    text="Pick a Color"
                                    disabled={disabled}
                                />
                            </Popover2>
                            <Button
                                outlined={true}
                                icon={'reset'}
                                disabled={disabled}
                                onClick={() => {
                                    setOption('backgroundColor', '#00000000')
                                }}
                            />
                        </ButtonGroup>
                    </FormGroup>
                </Col>
            </Row>
        </OptionsStep>
    );
};

export default Options;
