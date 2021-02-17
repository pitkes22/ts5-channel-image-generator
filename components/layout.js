import React, {useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';
import {clamp, throttle} from "lodash";

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto ${({$previewWidth}) => $previewWidth}px;
  grid-template-rows: auto 250px;
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
  overflow-y: auto;
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
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`

const RESIZE_THRESHOLD = 5;
const MIN_WIDTH = 510;

const CursorStyle = createGlobalStyle`
  body {
    cursor: ${props => props.showResizeCursor ? `col-resize` : undefined};
    user-select: ${props => props.showResizeCursor ? 'none' : undefined};
  }
`

const Layout = ({main, preview, description}) => {
    const [previewWidth, setPreviewWidth] = useState(586);
    const [isResizing, setIsResizing] = useState(false);
    const [showCursor, setShowCursor] = useState(false);

    const isResizable = (event) => Math.abs(window.innerWidth - previewWidth - event.clientX) < RESIZE_THRESHOLD
    const onMouseDown = (event) => {
        if (isResizable(event)) {
            setIsResizing(true);
        }
    }

    const onMouseUp = () => {
        setIsResizing(false);
    }

    useEffect(() => {
        document.addEventListener('mouseleave', onMouseUp)
    }, []);

    const onMouseMove = (event) => {
        setShowCursor(isResizable(event));

        if (!isResizing) return;

        event.persist()
        throttle(() => {
            setPreviewWidth(clamp(window.innerWidth - event.clientX, MIN_WIDTH, window.innerWidth / 2));
        })()
    }

    return (
        <>
            <CursorStyle showResizeCursor={showCursor}/>
            <Grid
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                $previewWidth={previewWidth}
            >
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
        </>
    );
};

export default Layout;
