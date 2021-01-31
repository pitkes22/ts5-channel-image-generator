import React from 'react';
import styled from 'styled-components';

const PeknyText = styled.div`
    color: pink;
`

export const Psicek = ({velkost}) => {
    return (
        <div style={{fontSize: `${velkost}em`}}>
            🐶<PeknyText>Ahoj</PeknyText>
        </div>
    )
}

const Maciatko = () => {
    return (
        <div>
            Mnaaau;
            <Psicek velkost={2}/>
            <Psicek velkost={6}/>
            <Psicek velkost={0.5}/>
        </div>
    );
};

export default Maciatko;

