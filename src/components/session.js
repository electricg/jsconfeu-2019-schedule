import { Fragment } from 'react';

import { FavLabel } from './fav';

const Session = ({ data, multiple }) => {
    const { id, who, what, trackId, trackName, description } = data;
    return (
        <Fragment>
            <section id={id} className={`session ${trackId}`}>
                <FavLabel id={id} show={multiple}>
                    <span className="track">{trackName}</span>
                    <span className="what" role="heading" aria-level="3">
                        {what}
                    </span>
                    {who !== 'all' && <span className="speaker">{who}</span>}
                </FavLabel>
                {!!description && (
                    <details
                        className="description"
                        dangerouslySetInnerHTML={{
                            __html: `<summary>description</summary>${description}`
                        }}
                    />
                )}
            </section>
        </Fragment>
    );
};

export default Session;
