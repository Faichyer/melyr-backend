import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { config } from './config/config';
import Logging from './library/Logging';

const router = express();

// Connect to mongoose
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to Mongoose');
        StartServer();
    })
    .catch((error) => {
        Logging.error('Unable to connect: ');
        Logging.error(error);
    });

// Start if mongoose connection is set
const StartServer = () => {
    router.use((req, res, next) => {
        // Log the request
        Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            // Log the response
            Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    // Rules of our API
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    // Routes

    // Healthcheck
    router.get('/ping', (req, res, next) => res.status(200).json({ msg: 'pong' }));

    // Errors
    router.use((req, res, next) => {
        const error = new Error('Not found');
        Logging.error(error);

        return res.status(404).json({ msg: error.message });
    });

    // http
    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}.`));
};
