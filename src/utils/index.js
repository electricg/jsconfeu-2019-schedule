const cheerio = require('cheerio');

const parseData = html => {
    const data = {};
    const $ = cheerio.load(html);

    const $sessions = $('li.session');

    $sessions.each((i, el) => {
        const $el = $(el);

        const id = $el.attr('id');

        const datetime = $el.attr('datetime');
        const datetimeArr = datetime.split(' ');
        const [day, time] = datetimeArr;

        const who = $el
            .find('.speaker')
            .text()
            .replace('☆', '')
            .replace('★', '')
            .trim();

        const what = $el
            .find('h3')
            .text()
            .replace(who, '')
            .replace('☆', '')
            .replace('★', '')
            .trim();

        const trackName = $el
            .find('.track')
            .text()
            .trim();
        const trackId = $el
            .attr('class')
            .replace('session', '')
            .replace('time-row-item', '')
            .trim();

        const $description = $el.find('.description');
        const links = $description.find('a');
        links.each((i, el) => {
            const link = $(el);
            const href = link.attr('href');

            link.attr('target', '_blank').attr('rel', 'noopener');

            if (href.indexOf('http') !== 0) {
                link.attr('href', `https://2019.jsconf.eu${href}`);
            }
        });
        const description = $description.html();

        const details = {
            id,
            datetime,
            day,
            time,
            who,
            what,
            trackId,
            trackName,
            description
        };

        if (!data[day]) {
            data[day] = {};
        }

        if (!data[day][time]) {
            data[day][time] = {};
        }

        data[day][time][trackId] = details;
    });

    // console.log(data);

    return data;
};

module.exports = { parseData };
