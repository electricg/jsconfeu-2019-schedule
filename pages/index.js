import { Component } from 'react';

import Schedule from '../src/components/schedule';
import schedule from '../src/data/schedule.json';

class PageIndex extends Component {
    static async getInitialProps() {
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
