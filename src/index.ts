import dotenv from 'dotenv';
dotenv.config();

(async () => {
    await rotateWithBrightData();
})();

async function rotateWithBrightData() {
    const url = 'https://lumtest.com/myip.json';
    const rp = require('request-promise');
    const options = {
        url: url,
        proxy: `http://${process.env.luminatiUsername}-session-rand${Math.ceil(Math.random() * 10000000)}:${process.env.luminatiPassword}@zproxy.lum-superproxy.io:22225`,
        rejectUnauthorized: false
    };
    rp(options)
        .then(function (data) { console.log(data); })
        .catch(function (err) { console.error(err); });
}

