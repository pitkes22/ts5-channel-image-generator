import React from 'react';
import styled from "styled-components";

const Fieldset = styled.fieldset`
  padding: 0.35em 1.75em 1.625em;
  margin-bottom: 1rem;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.01);
`

const Legend = styled.legend`
  font-size: 3rem;
  font-weight: 600;
  color: rgb(255 255 255 / 20%);
`

const Step = ({number, children, ...other}) => {
    return (
        <Fieldset {...other}>
            <Legend>{number}</Legend>
            {children}
        </Fieldset>
    );
};

export default Step;
