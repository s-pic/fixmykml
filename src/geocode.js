require('dotenv').config();
const fetch = require('node-fetch');
const { DEBUG } = require("../config");

const {API_KEY, APP_ID, APP_CODE} = process.env;
const isAuthProvided = API_KEY || (APP_ID && APP_CODE);
if (!isAuthProvided) throw 'no authentication provided, check the docs';

module.exports = async (address) => {
    const url = compileUrl(address);
    DEBUG && console.log(`fetch using url ${url}`);

    return fetch(url)
        .then(checkHttpStatus)
        .then(res => res.json())
        .then(parseFeature)
        .catch(console.error.bind(console))
};

function checkHttpStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        throw Error(res.statusText);
    }
}


function parseFeature({Response}) {
    if (!(Response.View && Response.View.length)) return null;
    return  Response.View[0].Result[0].Location.DisplayPosition;
}

function compileUrl(address) {
    const baseUrl = `https://geocoder.cit.api.here.com/6.2/geocode.json`;
    const additionalParams = {
        searchtext: encodeURIComponent(address),
        app_id: APP_ID,
        app_code: APP_CODE,
        apiKey: API_KEY,
        country: 'DEU',
        city: 'Aachen',
    };
    const queryString = Object.entries(additionalParams)
        .map(keyValPair => keyValPair.join('='))
        .join('&');

    return `${baseUrl}?${queryString}`;
}
