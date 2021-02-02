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
import {Toaster} from "@blueprintjs/core";

export const toaster = typeof document !== "undefined" && Toaster.create();

export default function Home() {
    return (
        <>
            <Head>
                <title>TS5 Channel Image Generator</title>
                <link rel="icon" href="favicon.png"/>
            </Head>

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
