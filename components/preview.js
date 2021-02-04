import React, {useContext} from 'react';
import Room from "./room";
import {ImageManipulationContext} from "./imageManipulation";

const Preview = () => {
    let {results, rooms, setRooms} = useContext(ImageManipulationContext);

    if (rooms.length < results.length) return <div>Loading...</div>; // TODO: Not really nice solution

    const updateNthRoom = (n, diff) => {
        setRooms(rooms.map((room, i) => {
            if (i !== n) return room;
            return {...room, ...diff}
        }))
    }

    return (
        <div>
            {results.map((result, i) => {
                const room = rooms[i];

                let maxDepth = 32;
                if (i > 0) {
                    maxDepth = rooms[i - 1].depth + 1;
                }
                return <Room
                    name={`Room #${i + 1}`}
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
