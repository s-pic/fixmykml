const utils = require('./src/utils');
const geocode = require('./src/geocode');
const xml = require('./src/xml');
const { DEBUG, TIMEOUT } = require('./config');

main();

async function main() {
    // read input dir, expect a single .kml or .xml file TODO: handle unexpected file endings / contents
    const files  = await utils.readInputDir;
    if (!files) {
        throw new Error('No input file found! Check the docs.')
    }
    const actualFiles = files.filter(f => f !== '.gitkeep'); // TODO: handle this more gracefully
    if (actualFiles.length > 1) {
        throw new Error('Currently this only works for one input file');
    }
    const [ fileName ] = actualFiles;

    const file = await utils.readInputFile(fileName);
    const parseResult = await xml.parse(file);
    console.log(`parsed input file ${fileName} to xml`);
    DEBUG && console.log(JSON.stringify(parseResult, null, '\t'));
    const places = parseResult.kml.Document.Folder.Placemark;
    console.log(`extracted ${places.length} places`);
    DEBUG && utils.printJson(places);

    const [withCoords, withOutCoords] = utils.partitionList(places, place => !!place.Point);
    DEBUG && utils.printJson(withOutCoords);
    console.log(`partitioned items. got ${withCoords
        .length} places WITH coords and ${withOutCoords.length} withOUT coords`);

    const augmentedPlaces = await handleItemsWithoutCoords(withOutCoords);
    ensureEveryAugmentedPlaceNowHasCoords(augmentedPlaces);

    // if all is good, write back places to json representation of xml
    parseResult.kml.Document.Folder.Placemark = [...withOutCoords, ...withCoords];
    const resultXml = xml.build(parseResult); // string
    DEBUG && utils.printXml(resultXml);
    await utils.writeOutputFile(fileName, resultXml);

    utils.logSuccessBanner();
    console.log(`Created output file at ${utils.getOutputFilePath(fileName)}`);
}


async function handleItemsWithoutCoords(places) {
    ensureEveryPlaceHasAnAddress(places);
    return geocodePlaces(places);
}

async function geocodePlaces(places) {
    const placesToGeocode = [...places]; // work on a copy
    const totalNum = placesToGeocode.length;
    let round = 0;
    await utils.asyncForEach(placesToGeocode, async (place) => {
        round++;
        const address = place.name;
        console.log(`${round} / ${totalNum} Looking up ${address} ..`);
        const coords = await geocode(address);
        if (coords) {
            DEBUG && console.log(`got coords ${utils.formatJson(coords)}`);
            // attach coords to place as kml expects it
            const {Latitude, Longitude} = coords;
            place.Point = {};
            place.Point.coordinates = [Longitude, Latitude, 0].join();
        } else {
            DEBUG && console.log(`got no coords for address ${place}`)
        }
        await utils.sleep(TIMEOUT || 2000); // add a little delay to prevent breaking any license agreements
    });
    return placesToGeocode
}


function ensureEveryPlaceHasAnAddress(places) {
    utils.ensureEveryItemHas(
        places,
            places => place => !!place.address,
        'not every places has an address!'
    )

}

function ensureEveryAugmentedPlaceNowHasCoords(places) {
    utils.ensureEveryItemHas(
        places,
        place => !!place.Point.coordinates,
        'not every place has coords!'
    )
}
