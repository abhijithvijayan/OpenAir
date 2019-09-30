// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const next = require('next');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const api = require('./api');
const app = require('./controllers/appController');
const { catchErrors } = require('./handlers/errorHandlers');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 4000;

const nextApp = next({ dev, dir: '../packages/web' });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const server = express();

    /* Logger */
    if (dev) {
        server.use(morgan('dev'));
    }
    server.use(cookieParser());
    server.use(bodyParser.json());
    server.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    /* ---------------------------------------- */
    /* -------------- View routes ------------- */
    /* ---------------------------------------- */

    server.get('/api/v1/', api.sendStatus);

    server.get('/', (req, res) => {
        return nextApp.render(req, res, '/');
    });

    /* ---------------------------------------- */
    /* ---------- Ends Custom Routes ---------- */
    /* ---------------------------------------- */

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        // eslint-disable-next-line no-console
        console.log(`> Express running on http://localhost:${port}`);
    });
});
