import React from 'react';
import styled from 'styled-components';

const RoomWrapper = styled.div`
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
`

const RoomContainer = styled.div`
  background-color: #1c2538;
  border-radius: 5px;
  height: 22px;
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
  width: 150px;
  height: 100%;
  top: 0;
  bottom: 0;
  border-radius: var(--tsv-border-radius);
  background: linear-gradient(to right, transparent 0%, #131824 22px 60%, transparent 100%);
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
`

/**
 * Renders one room in the preview. It should be rendered exactly the same way as in TeamSpeak 5 Client.
 *
 * @param name Name of the room
 * @param image Background image of the room (URL)
 * @return {JSX.Element}
 * @constructor
 */
const Room = ({name, image}) => {
    return (
        <RoomWrapper>
            <RoomContent>
                <RoomIcon>
                    <img src={`roomIcon.svg`} alt={'Room Icon'}/>
                </RoomIcon>
                <RoomTitle>{name}</RoomTitle>
            </RoomContent>
            <RoomContainer>
                {image && <Image src={image} alt="Banner Fragment"/>}
                <ImageMask/>
            </RoomContainer>
        </RoomWrapper>
    );
};

export default Room;
