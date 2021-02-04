import React, {useContext} from 'react';
import Room from "./room";
import {ImageManipulationContext} from "./imageManipulation";

const Preview = () => {
    let {results, rooms, setRooms} = useContext(ImageManipulationContext);

    const updateNthRoom = (n, diff) => {
        setRooms(rooms.map((room, i) => {
            if (i !== n) return room;
            return {...room, ...diff}
        }))
    }

    let roomsIndex = 1, spacersIndex = 1;

    return (
        <div>
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
        </div>
    );
};

export default Preview;
