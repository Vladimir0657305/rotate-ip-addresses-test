import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
dotenv.config();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

(async () => {
    await rotateWithBrightData();
})();

async function rotateWithBrightData() {
    const url = 'https://www.phin.org.uk/search/consultants?s_location_input=London&s_location_coordinates=51.5072178%2C-0.1275862&s_speciality_input=General%20medicine&s_speciality_id=300';
    const rp = require('request-promise');
    const options = {
        url: url,
        proxy: `http://${process.env.luminatiUsername}-session-rand${Math.ceil(Math.random() * 10000000)}:${process.env.luminatiPassword}@zproxy.lum-superproxy.io:22225`,
        rejectUnauthorized: false
    };
    const html = await rp(options);
    // console.log(html);
    const { window } = new JSDOM(html);
    const parser = new window.DOMParser();
    console.log(parser);
    const doc = parser.parseFromString(html, "text/html");
    console.log(doc);
    const result = doc.querySelector(".results");
    
    // console.log(result);
    window.document.body.innerHTML = result.innerHTML;
    console.log(window.document.documentElement.outerHTML);
}

