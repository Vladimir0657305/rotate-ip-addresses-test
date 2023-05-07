import { createObjectCsvWriter } from 'csv-writer';
import dotenv from 'dotenv';
import express from 'express';
import * as parse5 from 'parse5';
import { TreeAdapter } from 'parse5';
import { rotateWithBrightData } from './rotateWithBrightData';
const fs = require('fs');
import * as domUtils from "@degjs/dom-utils";
const { parse } = require('node-html-parser');
const cheerio = require('cheerio');


// import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = 3000;
const parsedData = [];
const foundEmails = new Set();
const foundPhones = new Set();


// (async () => {
//     const url = 'https://www.example.com';
//     const data = await rotateWithBrightData(url);
//     console.log(data);
// })();

app.get('/', async (req, res) => {
    try {
        let page = 0;
        const lastPage =21;
        let url = 'https://www.phin.org.uk/search/consultants?s_location_input=London&s_location_coordinates=51.5072178%2C-0.1275862&s_speciality_input=General%20medicine&s_speciality_id=300';
        let data = await rotateWithBrightData(url);
        // console.log(data);
        const hrefs = [];
        const document = parse5.parse(data);

        const findHref = (node) => {
            if (node.tagName === 'a') {
                const href = node.attrs.find((attr) => attr.name === 'href');
                const viewButtonAttr = node.attrs.find((attr) => attr.name === 'class' && attr.value.includes('button blue view-button svelte-divrqn'));
                if (href && viewButtonAttr) {
                    const fullHref = `https://www.phin.org.uk${href.value}`;
                    hrefs.push(href.value);
                }
            }
            if (node.childNodes) {
                node.childNodes.forEach((childNode) => findHref(childNode));
            }
        };



        function findH1WithClass(document) {
            const h1Elements = [];

            function traverse(node) {
                if (node.nodeName === 'div' &&
                    node.attrs &&
                    node.attrs.some(attr => attr.name === 'class' && attr.value === 'main-content svelte-ectbpk')) {
                    findH1(node);
                }

                if (node.childNodes) {
                    node.childNodes.forEach(childNode => traverse(childNode));
                }
            }

            function findH1(node) {
                if (node.nodeName === 'h1' &&
                    node.attrs &&
                    node.attrs.some(attr => attr.name === 'class' && attr.value === 'svelte-ectbpk')) {
                    return node.childNodes[0].value;
                }

                return node.childNodes && node.childNodes.length > 0 ? findH1(node.childNodes[0]) : null;
            }

            traverse(document);
            return h1Elements;
        }



        const findData = (node) => {
            const title = findH1WithClass(node);
            parsedData.push(title);
            console.log('Name=>', title);

            if (node.attrs) {
                const href = node.attrs.find((attr) => attr.name === 'href' && attr.value.startsWith('mailto:'));
                if (href) {
                    const emailTemp = href.value.substring(7);
                    const email = emailTemp.split('?')[0];
                    if (!foundEmails.has(email)) {
                        console.log('EMAIL=>', email);
                        parsedData.push(email);
                        foundEmails.add(email);
                    }
                }
                const tel = node.attrs.find((attr) => attr.name === 'href' && attr.value.startsWith('tel:'));
                if (tel) {
                    const phone = tel.value.substring(4);
                    if (!foundPhones.has(phone)) {
                        console.log('PHONE=>', phone);
                        parsedData.push(phone);
                        foundPhones.add(phone);
                    }
                }
            }
            if (node.childNodes) {
                node.childNodes.forEach((childNode) => findData(childNode));
            }
        };


        findHref(document);


        // let nextPageUrl;


        while(page <= 1) {
            while (hrefs.length != 0) {
                const nextUrl = `https://www.phin.org.uk/${hrefs.shift()}`;
                console.log('PAGE=>', page, 'NEXTURL=>', nextUrl);
                const dataNext = await rotateWithBrightData(nextUrl);
                // console.log(dataNext);
                const documentNext = parse5.parse(dataNext);
                findData(documentNext);
            }
            page++;
            const nextPageUrl = url + `&s_page_number=${page}`;
            data = await rotateWithBrightData(nextPageUrl);
            const nextPageData = parse5.parse(data);
            findHref(nextPageData);
        }

        // Convert parsedData array to CSV format and write to file
        const csvData = parsedData.map((data) => {
            return `"${data}",`;
        }).join("");

        fs.writeFile('file.csv', csvData, (err) => {
            if (err) throw err;
            console.log('Data has been written to file');
        });
        res.send('Data parsed successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
