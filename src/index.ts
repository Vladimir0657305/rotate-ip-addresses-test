import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
import express from 'express';
import { rotateWithBrightData } from './rotateWithBrightData';

dotenv.config();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();
const port = 3000;



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
