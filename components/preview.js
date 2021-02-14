import React, {useContext} from 'react';
import Room from "./room";
import {defaultRoom, ImageManipulationContext} from "./imageManipulation";
import {Button, Callout} from "@blueprintjs/core";
import styled from "styled-components";

const ResetCallout = styled(Callout)`
  margin-top: 1em;

  button {
    margin-top: 1em;
  }
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
`

const ScrollWrapper = styled.div`
  position: relative;
  height: calc(100% - 140px);
  overflow: auto;
`

const Preview = () => {
    let {results, rooms, setRooms} = useContext(ImageManipulationContext);

    const updateNthRoom = (n, diff) => {
        setRooms(rooms.map((room, i) => {
            if (i !== n) return room;
            return {...room, ...diff}
        }))
    }

    const resetAllRooms = () => setRooms(rooms.map((room, i) => defaultRoom));

    let roomsIndex = 1, spacersIndex = 1;

    return (
        <Wrapper>
            <ScrollWrapper>
                {results.map((result, i) => {
                    const room = rooms[i];

                    let maxDepth = 32;
                    if (i > 0) {
                        maxDepth = rooms[i - 1].depth + 1;
                    }
                    return <Room
                        name={room.spacer ? `Spacer #${spacersIndex++}` : `Room #${roomsIndex++}`}
                        image={result}
                        key={i}
                        isSpacer={room.spacer}
                        depth={room.depth}
                        maxDepth={maxDepth}
                        setIsSpacer={() => updateNthRoom(i, {spacer: !room.spacer})}
                        onDepthUp={() => updateNthRoom(i, {depth: room.depth - 1})}
                        onDepthDown={() => updateNthRoom(i, {depth: room.depth + 1})}
                    />
                })}

            </ScrollWrapper>
            <ResetCallout icon={'info-sign'} title={'Customoze your channels structure'} intent={"primary"}>
                You can use arrows on the right of the channel preview to make nested channels and toggle between normal
                room and spacer.
                <Button
                    icon={'reset'}
                    outlined
                    fill
                    onClick={resetAllRooms}
                >
                    Reset
                </Button>
            </ResetCallout>
        </Wrapper>
    );
};

export default Preview;
