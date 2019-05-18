import React from 'react';
import { Fragment } from 'react';
import { Main } from 'next/document';

export default class MyMain extends Main {
    render() {
        const { html } = this.context._documentProps;

        return (
            <Fragment>
                <div
                    id="__next"
                    className="__next-wrapper"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </Fragment>
        );
    }
}
