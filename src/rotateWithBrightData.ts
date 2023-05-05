import rp from 'request-promise';

export async function rotateWithBrightData(url) {
    console.log('URL=>', url);
    // const url = 'https://www.phin.org.uk/search/consultants?s_location_input=London&s_location_coordinates=51.5072178%2C-0.1275862&s_speciality_input=General%20medicine&s_speciality_id=300';
    const options = {
        url: url,
        proxy: `http://${process.env.luminatiUsername}-session-rand${Math.ceil(Math.random() * 10000000)}:${process.env.luminatiPassword}@zproxy.lum-superproxy.io:22225`,
        rejectUnauthorized: false
    };
    const data = await rp(options);
    return data;
}
