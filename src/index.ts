import dotenv from 'dotenv';
import express from 'express';
import { rotateWithBrightData } from './rotateWithBrightData';

dotenv.config();

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const data = await rotateWithBrightData();
    res.send(data);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
