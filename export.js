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

const doIt = async () => {
    // save schedule.html
    await saveScheduleHtml();

    // schedule.json
    saveScheduleJson();

    // delete output folder
    deleteFolder(outputFolder);

    // run next build & export
    exec('npm run export');
    console.log('\nbuilt and exported');

    // remove output/_next folder
    deleteFolder(`${outputFolder}/_next`);

    // add sw.js
    writeFileSWJS();

    // add manifest.json
    writeFileManifestJson();

    // add now.json
    writeFileNowJson();

    // run beautify
    exec('npm run beautify');
    console.log('beautified');

    // deploy
    exec('npm run now-deploy && npm run now-alias');
    console.log('deployed');
};

doIt();
