import React, {useState} from 'react';
import styled from 'styled-components';
import {Button} from "@blueprintjs/core";
import {CHANNEL_DEPTH_OFFSET} from "./imageManipulation";

const RoomWrapper = styled.div`
  height: ${({$isSpacer}) => $isSpacer ? 26 : 30}px;
  margin-left: ${({$depthOffset}) => $depthOffset}px;
  width: calc(100% - ${({$depthOffset}) => $depthOffset});
  display: flex;
  align-items: center;
  position: relative;
`

const RoomContainer = styled.div`
  background-color: ${({$isSpacer}) => $isSpacer ? 'none' : '#1c2538'};
  border-radius: 5px;
  height: ${({$isSpacer}) => $isSpacer ? 16 : 22}px;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
`

const Image = styled.img`
  width: 500px;
  height: auto;
  object-fit: contain;
  object-position: 0 50%;
  -webkit-mask-image: linear-gradient(to right, black calc(100% - 88px), transparent 100%);
`

const ImageMask = styled.div`
  position: absolute;
  max-width: 100%;
  width: ${({$isSpacer}) => $isSpacer ? '100%' : '150px'};
  height: 100%;
  top: 0;
  bottom: 0;
  border-radius: var(--tsv-border-radius);
  background: ${({$isSpacer}) => $isSpacer
          ? 'linear-gradient(to right, transparent 0%, #131824 45% 55%, transparent 100%)'
          : 'linear-gradient(to right, transparent 0%, #131824 22px 60%, transparent 100%)'};
`

const RoomContent = styled.div`
  padding-left: 11px;
  display: flex;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  z-index: 1;
  align-items: center;
`

const RoomIcon = styled.div`
  height: 24px;
  width: 24px;
  margin-right: 6px;
`

const RoomTitle = styled.span`
  text-shadow: 0 0 10px #131824;
  line-height: 1.5em;
  font-size: 15px;
  margin-left: 6px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const SpacerTitle = styled.span`
  display: inline-block;
  width: 100%;
  font-size: 13.6px;
  font-style: italic;
  color: #697a97;
  text-align: center;
`

const ControlsWrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
`

const RoomButton = ({...other}) => (<Button
    // minimal={true}
    small={true}
    outlined={true}
    {...other}
/>)

const StyledRoomButton = styled(RoomButton)`
  zoom: 0.7;
  margin-right: 0.2em;
`

/*
* Spacer: 26px wrapper size - 16px size of banner
*
* */

/**
 * Renders one room in the preview. It should be rendered exactly the same way as in TeamSpeak 5 Client.
 *
 * @param name Name of the room
 * @param image Background image of the room (URL)
 * @param isSpacer If set room will render as spacer
 * @param setIsSpacer Callback when Spacer toggle is clicked
 * @param onDepthUp Callback when depth down is clicked
 * @param onDepthDown Callback when depth up is clicked
 * @param depth Depth of the channel
 * @param maxDepth Maximum allowd depth (based on the depth of the paren channel)
 * @param other
 * @return {JSX.Element}
 * @constructor
 */
const Room = ({name, image, isSpacer, setIsSpacer, onDepthUp, onDepthDown, depth, maxDepth, ...other}) => {
    return (
        <RoomWrapper $isSpacer={isSpacer} $depthOffset={depth * CHANNEL_DEPTH_OFFSET} {...other}>
            <RoomContent>
                {!isSpacer && <RoomIcon>
                    <img src={`roomIcon.svg`} alt={'Room Icon'}/>
                </RoomIcon>}
                {isSpacer ? <SpacerTitle>{name}</SpacerTitle> : <RoomTitle>{name}</RoomTitle>}
                <ControlsWrapper>
                    {depth === 0 && <StyledRoomButton onClick={setIsSpacer}>{isSpacer ? 'room' : 'spacer'}</StyledRoomButton>}
                    {!isSpacer && <>
                        <StyledRoomButton onClick={onDepthUp} icon={'chevron-left'} disabled={depth <= 0}/>
                        <StyledRoomButton onClick={onDepthDown} icon={'chevron-right'} disabled={depth >= 32 || depth >= maxDepth}/>
                    </>}
                </ControlsWrapper>
            </RoomContent>
            <RoomContainer $isSpacer={isSpacer}>
                {image && <Image src={image} alt="Banner Fragment"/>}
                {image && <ImageMask $isSpacer={isSpacer}/>}
            </RoomContainer>
        </RoomWrapper>
    );
};

export default Room;
