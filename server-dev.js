const express = require('express');
const next = require('next');

const { createFileSWJS, createFileManifestJson } = require('./src/utils');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        // custom handlers go here…
        server.get('/sw.js', (req, res) => {
            const content = createFileSWJS();
            res.set('Content-Type', 'application/javascript');
            res.send(content);
        });

        server.get('/manifest.json', (req, res) => {
            const content = createFileManifestJson();
            res.set('Content-Type', 'application/json');
            res.send(content);
        });

        server.get('/schedule.json', async (req, res) => {
            res.set('Content-Type', 'application/json');
            res.sendFile(`${__dirname}/src/data/schedule.json`);
        });

        server.get('/schedule', (req, res) => {
            res.set('Content-Type', 'text/html');
            res.sendFile(`${__dirname}/src/data/schedule.html`);
        });

        server.get('*', (req, res) => handle(req, res));

        server.listen(3000, err => {
            if (err) {
                throw err;
            }
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
