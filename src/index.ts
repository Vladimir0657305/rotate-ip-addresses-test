import dotenv from 'dotenv';
import express from 'express';
import * as parse5 from 'parse5';
import { rotateWithBrightData } from './rotateWithBrightData';
const fs = require('fs');
import * as domUtils from "@degjs/dom-utils";
const { parse } = require('node-html-parser');


// import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = 3000;
const parsedData = [];
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// (async () => {
//     const url = 'https://www.example.com';
//     const data = await rotateWithBrightData(url);
//     console.log(data);
// })();

app.get('/', async (req, res) => {
    try {
        let page = 0;
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
            // console.log(node);
            let name = '';
            let emailHref;
            let phoneHref;

            // const elements: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('p[id="entity-name"]');
            const elements = parse(node);
            // const elements: NodeListOf<HTMLParagraphElement> = node.querySelectorAll('p[id="entity-name"]');
            // console.log(elements);

            // const nameGEl = node.querySelector('#email-button');
            // console.log('EEEEEEEEEEEEE',nameGEl);
            // const nameEl = node.querySelector('action-link svelte-2ib066');
            // console.log(nameEl);
            // nameEl.forEach(el => {
            //     name = el.textContent.trim();
            //     console.log('Name:', name);
            // });


            // if (node.tagName === 'p' && node.attrs.find((attr) => attr.name === 'id' && attr.value === 'entity-name')) {
            //     name = node.childNodes.find((childNode) => childNode.nodeName === '#text').value.trim();
            //     console.log('Name:', name);
            // }

            if (node.tagName === 'div' && node.attrs.find((attr) => attr.name === 'id' && attr.value === 'email-button')) {
                console.log('OOOOOOOOOOOOOOO');
                const emailLink = node.querySelector('a') as HTMLAnchorElement;
                emailHref = emailLink?.getAttribute('href') || '';
                console.log('Email:', emailHref);
            }

            if (node.tagName === 'div' && node.attrs.find((attr) => attr.name === 'id' && attr.value === 'call-button')) {
                const phoneLink = node.querySelector('a') as HTMLAnchorElement;
                phoneHref = phoneLink?.getAttribute('href') || '';
                console.log('Phone:', phoneHref);
            }

            parsedData.push([page, name, emailHref, phoneHref]);


            if (node.childNodes) {
                node.childNodes.forEach((childNode) => {
                    if (childNode.nodeType === 1) {
                        findData(childNode);
                    }
                });
            }

        };


        findHref(document);

        while (hrefs.length > 0 && page < 2) {
            page++;
            let dataNext;
            const nextPageUrl = url + `&s_page_number=${page}`;
            const nextUrl = `https://www.phin.org.uk/${hrefs.shift()}`;

            console.log('PAGE=>', page, 'NEXTURL=>', nextUrl);
            dataNext = await rotateWithBrightData(nextUrl);
            const documentNext = parse5.parse(dataNext);


            console.log('DDDDDDDDDDDDDDD', dataNext);
            // console.log('LLLLLLLLLLLLLLLL', documentNext);

            const dom = new JSDOM(dataNext);
            // console.log(dom);
            // const document = dom.window.document;
            const document = parse(dataNext);
            // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! =>', document);
            findData(documentNext);

            // const nextDocument = parse5.parse(dataNext);
            // const nextDocument = parse5.parse(dataNext.toString());

            // findData(nextDocument);

            if (hrefs.length === 0 && page > 0) {
                url = nextPageUrl;
                console.log('PAGE=>', page, 'URL = NEXTPAGEURL=>', url);
                data = await rotateWithBrightData(url);
                const finalDocument = parse5.parse(data);
                const finalHrefs = hrefs.slice();

                while (finalHrefs.length > 0) {
                    const finalUrl = `https://www.phin.org.uk/${finalHrefs.shift()}`;
                    const finalData = await rotateWithBrightData(finalUrl);
                    const finalDocument = parse5.parse(finalData);
                    findData(finalDocument);
                }
            }
        }

        fs.writeFile('file.txt', JSON.stringify(parsedData), (err) => {

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
