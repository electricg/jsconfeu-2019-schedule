const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const _package = require('../../package.json');
const { version, config } = _package;
const {
    nameLong,
    nameShort,
    inputUrl,
    inputUrlBase,
    nowName,
    outputFolder
} = config;

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
                link.attr('href', `${inputUrlBase}${href}`);
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

const downloadSchedule = async url => {
    const html = await axios.get(url);
    return html.data;
};

const saveScheduleHtml = async () => {
    const html = await downloadSchedule(inputUrl);
    fs.writeFileSync(`${__dirname}/../../src/data/schedule.html`, html);
    console.log('wrote schedule.html');
};

const saveScheduleJson = () => {
    const html = fs.readFileSync(`${__dirname}/../../src/data/schedule.html`);
    const json = parseData(html);
    fs.writeFileSync(
        `${__dirname}/../../src/data/schedule.json`,
        JSON.stringify(json, null, 4)
    );
    console.log('wrote schedule.json');
};

const createFileSWJS = () => {
    const content = fs.readFileSync(
        `${__dirname}/../../src/static/js/sw.js`,
        'utf8'
    );
    const js = content.replace('@VERSION@', version);
    return js;
};

const writeFileSWJS = () => {
    const js = createFileSWJS();
    fs.writeFileSync(`${__dirname}/../../${outputFolder}/sw.js`, js);
    console.log('wrote sw.js');
};

const createFileManifestJson = () => {
    const content = fs.readFileSync(
        `${__dirname}/../../src/static/js/manifest.json`,
        'utf8'
    );
    const js = content
        .replace('@NAMELONG@', nameLong)
        .replace('@NAMESHORT@', nameShort);
    return js;
};

const writeFileManifestJson = () => {
    const js = createFileManifestJson();
    fs.writeFileSync(`${__dirname}/../../${outputFolder}/manifest.json`, js);
    console.log('wrote manifest.json');
};

const createFileNowJson = () => {
    const content = fs.readFileSync(
        `${__dirname}/../../src/static/js/now.json`,
        'utf8'
    );
    const js = content.replace('@NOWNAME@', nowName);
    return js;
};

const writeFileNowJson = () => {
    const js = createFileNowJson();
    fs.writeFileSync(`${__dirname}/../../${outputFolder}/now.json`, js);
    console.log('wrote now.json');
};

// https://stackoverflow.com/a/32197381
const deleteFolderRecursive = path => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            var curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const deleteFolder = path => {
    deleteFolderRecursive(path);
    console.log(`deleted ${path}`);
    return;
};

module.exports = {
    saveScheduleHtml,
    saveScheduleJson,
    createFileSWJS,
    writeFileSWJS,
    createFileManifestJson,
    writeFileManifestJson,
    createFileNowJson,
    writeFileNowJson,
    deleteFolder
};
