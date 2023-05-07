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
let counter = 1;

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



        const findData = (node) => {
            const mainContentDiv = findDivWithClass(node, 'main-content svelte-ectbpk');
            const title = findFirstH1(mainContentDiv);
            const mainContentDivAbout = findDivWithClass(node, 'body-section svelte-1cjckml');
            console.log('mainContentDivAbout=>', mainContentDivAbout);
            const contentContainerDiv = findDivWithClass(mainContentDivAbout, 'content-container svelte-1cjckml');
            console.log('contentContainerDiv=>',contentContainerDiv);
            // const targetDiv = findDivWithClass(contentContainerDiv, 'svelte-1u2io8r');
            // console.log('targetDiv=>', targetDiv);
            // const targetPTag = findPTagById(targetDiv, 'profile-about-sub-specialities');

            const subSpecialities = findSubSpecialities(contentContainerDiv);
            console.log('subSpecialities=>',subSpecialities);

            const email = findEmail(node, 'center svelte-11uoyco');
            const phone = findPhone(node, 'center svelte-11uoyco');

            parsedData.push(`${counter},${title},${email},${phone}`);

            console.log(parsedData);
            counter++;
        }

        const findDivWithClass = (node, className) => {
            // console.log('current node:', node);
            if (node && node.nodeName === 'div' &&
                node.attrs &&
                node.attrs.some(attr => attr.name === 'class' && attr.value === className)) {
                console.log('div with class found:', node);
                return node;
            }

            if (node && node.childNodes) {
                for (const childNode of node.childNodes) {
                    const result = findDivWithClass(childNode, className);
                    if (result) {
                        console.log('div with class found:', result);
                        return result;
                    }
                }
            }

            console.log('div with class not found');
            return null;
        }

        const findFirstH1 = (node) => {
            if (node.nodeName === 'h1') {
                const name = node.childNodes.find((childNode) => childNode.nodeName === '#text').value.trim();
                console.log('Name=>', name);
                return name;
            }

            if (node.childNodes) {
                return findFirstH1(node.childNodes[0]);
            }

            return null;
        }
        



        const findSubSpecialities = (node) => {
            console.log('WORK22');
            // console.log(node);

            const printNodes = (node) => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    console.log('Text node: ' + node.textContent);
                } else if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim() !== '') {
                    console.log('Element: ' + node.nodeName + ' - ' + node.textContent);
                }

                if (node.childNodes) {
                    for (const childNode of node.childNodes) {
                        printNodes(childNode);
                    }
                }
            }
            printNodes(node);

            if (node && node.nodeName === 'div' &&
                node.attrs &&
                node.attrs.some(attr => attr.name === 'class' && attr.value === 'svelte-1u2io8r')) {
                console.log('WORK33');
                const pTags = node.childNodes.filter(childNode => childNode.nodeName === 'p');
                console.log('pTags=>',pTags);
                const subSpecialityPTag = pTags.find(pTag => pTag.attrs && pTag.attrs.some(attr => attr.name === 'id' && attr.value === 'profile-about-sub-specialities'));

                if (subSpecialityPTag) {
                    const subSpecialityText = subSpecialityPTag.childNodes.find(childNode => childNode.nodeName === '#text').value.trim();
                    console.log('Sub-speciality:', subSpecialityText);
                    return subSpecialityText;
                }
            }

            if (node && node.childNodes) {
                for (const childNode of node.childNodes) {
                    const result = findSubSpecialities(childNode);
                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        }



        const findPTagById = (node, id) => {
            if (node.nodeName === 'p' &&
                node.attrs &&
                node.attrs.some(attr => attr.name === 'id' && attr.value === id)) {
                return node;
            }

            if (node.childNodes) {
                for (const childNode of node.childNodes) {
                    const result = findPTagById(childNode, id);
                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        };



        const findEmail = (node, className) => {
            if (node.nodeName === 'a' &&
                node.attrs &&
                node.attrs.some(attr => attr.name === 'href' && attr.value.startsWith('mailto:'))) {
                return node.attrs.find(attr => attr.name === 'href').value.slice(7).split('?')[0];
            }

            if (node.childNodes) {
                for (const childNode of node.childNodes) {
                    const result = findEmail(childNode, className);
                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        }

        const findPhone = (node, className) => {
            if (node.nodeName === 'a' &&
                node.attrs &&
                node.attrs.some(attr => attr.name === 'href' && attr.value.startsWith('tel:'))) {
                return node.attrs.find(attr => attr.name === 'href').value.slice(4);
            }

            if (node.childNodes) {
                for (const childNode of node.childNodes) {
                    const result = findPhone(childNode, className);
                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        }





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
            return data.join(',') + '\n';
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
