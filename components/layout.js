import React from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto 586px;
  grid-template-rows: auto 200px;
  min-height: 100vh;
  min-width: 100vw;
  height: 100vh;
  width: 100vw;
  color: white;
`

const AreaMain = styled.main`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;
  background-color: #1c2538;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`

const AreaPreview = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
  background-color: #2b3346;
  padding: 1rem;
  overflow: auto;
`

const AreaDescription = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  background-color: #2b3346;
  padding: 1rem;
`

const Layout = ({main, preview, description}) => {
    return (
        <Grid>
            <AreaMain>
                {main}
            </AreaMain>
            <AreaPreview>
                {preview}
            </AreaPreview>
            <AreaDescription>
                {description}
            </AreaDescription>
        </Grid>
    );
};

export default Layout;
