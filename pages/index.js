import { Component } from 'react';
import axios from 'axios';

import { parseData } from '../src/utils';

import Schedule from '../src/components/schedule';

const url = 'http://localhost:3000/schedule/';

class PageIndex extends Component {
    static async getInitialProps() {
        const html = await axios.get(url);

        const schedule = parseData(html.data);

        return { schedule };
    }

    render() {
        const { schedule } = this.props;

        return (
            <main>
                <Schedule data={schedule} />
            </main>
        );
    }
}

export default PageIndex;
