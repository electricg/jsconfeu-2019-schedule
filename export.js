const exec = require('child_process').execSync;

const {
    saveScheduleHtml,
    saveScheduleJson,
    writeFileSWJS,
    writeFileManifestJson,
    writeFileNowJson,
    deleteFolder
} = require('./src/utils');

const _package = require('./package.json');
const { config } = _package;
const { outputFolder } = config;

const json = async () => {
    // save schedule.html
    await saveScheduleHtml();

    // schedule.json
    saveScheduleJson();
};

const build = () => {
    // update package version
    const output = exec('npm run patch').toString();
    const last = output.lastIndexOf('v');
    const ver = output.substring(last + 1);
    console.log(`bumped version to ${ver}`);

    // delete output folder
    deleteFolder(outputFolder);

    // run next build & export
    exec('npm run export');
    console.log('\nbuilt and exported');

    // remove output/_next folder
    deleteFolder(`${outputFolder}/_next`);

    // add sw.js
    writeFileSWJS(ver);

    // add manifest.json
    writeFileManifestJson();

    // add now.json
    writeFileNowJson();

    // run beautify
    exec('npm run beautify');
    console.log('beautified');
};

const deploy = () => {
    // deploy
    exec('npm run now-deploy && npm run now-alias');
    console.log('deployed');
};

const all = async () => {
    await json();
    build();
    deploy();
};

if (process.argv.includes('json')) {
    json();
}

if (process.argv.includes('build')) {
    build();
}

if (process.argv.includes('deploy')) {
    deploy();
}

if (process.argv.includes('all')) {
    all();
}
