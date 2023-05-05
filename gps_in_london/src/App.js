import React, { useState, useEffect } from 'react';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
dotenv.config();

function App() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    async function fetchData() {
      const url = 'https://www.phin.org.uk/search/consultants?s_location_input=London&s_location_coordinates=51.5072178%2C-0.1275862&s_speciality_input=General%20medicine&s_speciality_id=300';
      const rp = require('request-promise');
      const options = {
        url: url,
        proxy: `http://${process.env.luminatiUsername}-session-rand${Math.ceil(Math.random() * 10000000)}:${process.env.luminatiPassword}@zproxy.lum-superproxy.io:22225`,
        rejectUnauthorized: false
      };
      const html = await rp(options);
      console.log(html);
      const { window } = new JSDOM(html);
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const result = doc.querySelector(".results").innerHTML;
      setHtml(result);
      console.log(window.document.documentElement.outerHTML);
    }
    fetchData();
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} className='results' />
  );
}

export default App;
