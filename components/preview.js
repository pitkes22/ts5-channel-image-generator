import React, {useContext} from 'react';
import Room from "./room";
import {ImageManipulationContext} from "./imageManipulation";

const Preview = () => {
    const {results} = useContext(ImageManipulationContext);

    return (
        <div>
            {results.map((result, i) => <Room
                name={`Room #${i + 1}`}
                image={result}
                key={i}
            />)}
        </div>
    );
};

export default Preview;
