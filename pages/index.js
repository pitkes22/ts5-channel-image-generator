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

export default function Home() {
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico"/>
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
