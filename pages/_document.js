import Document from 'next/document';
import Head from './_head';
import Main from './_main';

import { version } from '../package.json';

import css from 'raw-loader!../src/static/css/style.css';
// Enforce that only the loader in the import statement is used by prefixing it with a !
import js from '!raw-loader!../src/static/js/script.js';

class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <meta
                        name="author"
                        content="Giulia Alfonsi - @electric_g"
                    />
                    <meta name="robots" content="noindex,nofollow" />

                    <link rel="manifest" href="/static/manifest.json" />

                    <link
                        rel="all-the-source"
                        href="https://github.com/electricg/jsconfeu-2019-schedule"
                    />

                    <link
                        href="/static/images/icons/icon-32x32.png"
                        rel="icon"
                        sizes="32x32"
                        type="image/png"
                    />
                    <link
                        href="/static/images/icons/icon-16x16.png"
                        rel="icon"
                        sizes="16x16"
                        type="image/png"
                    />

                    <title>JSConf EU 2019 Schedule</title>

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `document.documentElement.className = '🦄';`
                        }}
                    />

                    <style dangerouslySetInnerHTML={{ __html: css }} />
                </Head>
                <body>
                    <span className="version">
                        v{version}
                        <span className="airplane" id="airplane" />
                    </span>

                    <Main />

                    <div
                        id="service-worker"
                        className="service-worker__wrapper"
                    >
                        <button
                            title="Dismiss"
                            className="service-worker__dismiss"
                            type="button"
                            id="service-worker-dismiss"
                        >
                            <svg
                                viewBox="0 0 32 32"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M21 8l-5 5-5-5-3 3 5 5-5 5 3 3 5-5 5 5 3-3-5-5 5-5z" />
                            </svg>
                        </button>
                        <p
                            id="service-worker-message"
                            className="service-worker__message"
                        />
                    </div>

                    <script dangerouslySetInnerHTML={{ __html: js }} />
                </body>
            </html>
        );
    }
}

export default MyDocument;
