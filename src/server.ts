import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { config } from './config/config';

const router = express();

// Connect to mongoose
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('connected');
    })
    .catch((error) => {
        console.log(error);
    });