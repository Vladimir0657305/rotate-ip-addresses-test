import dotenv from 'dotenv';
dotenv.config();

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
    rp(options)
        .then(function (data) { 
            // console.log(data); 
        })
        .catch(function (err) { console.error(err); });
}

