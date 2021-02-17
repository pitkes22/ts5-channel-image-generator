import Head from 'next/head'
import Layout from "../components/layout";

import 'normalize.css/normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';

import Preview from "../components/preview";
import Description from "../components/description";
import Upload from "../components/upload";
import Options from "../components/options";
import Export from "../components/export";
import ImageManipulation from "../components/imageManipulation";
import {FocusStyleManager, Toaster} from "@blueprintjs/core";
import {createGlobalStyle} from "styled-components";

export const toaster = typeof document !== "undefined" && Toaster.create();

FocusStyleManager.onlyShowFocusOnTabs();

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 20px;
  }
`


export default function Home() {
    return (
        <>
            <Head>
                <title>TS5 Channel Image Generator</title>
                <link rel="icon" href="favicon.png"/>
            </Head>

            <GlobalStyle/>

            <ImageManipulation>
                <Layout
                    main={(
                        <>
                            <Upload/>
                            <Options/>
                            <Export/>
                        </>
                    )}
                    preview={<Preview/>}
                    description={<Description/>}
                />
            </ImageManipulation>
        </>
    )
}
