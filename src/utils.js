const util = require('util');
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR_PATH = path.join(__dirname, '..', '/data');

const formatJson = json => JSON.stringify(json, null, '\t');

const getFullPath = relativePath => path.join(DATA_DIR_PATH, relativePath);
const getRelativOutputPath = fileName => path.join('/output', fileName);

module.exports = {
    readInputDir: fs.readdir(getFullPath('input')),
    readInputFile: async (fileName) => fs.readFile(getFullPath(
        path.join('/input', fileName)
    )),
    sleep: util.promisify(setTimeout),
    asyncForEach: async (array, callback, breakOnError = true) => {
        for (let index = 0; index < array.length; index++) {
            try {
                await callback(array[index], index, array);
            } catch (e) {
                console.error(e);
                if (breakOnError) {
                    break;
                } else {
                    throw e;
                }
            }
        }
    },
    partitionList: (list, func) => {
        return list.reduce((acc, val) => {
            acc[+!func(val)].push(val);
            return acc;
        }, [
            [], // partition 0
            []  // partition 1
        ])
    },
    formatJson,
    printJson: (json) => console.log(formatJson(json)),
    ensureEveryItemHas: (list, check, errorMessage) => {
        const everyItemHas = list.every(check);
        if (!everyItemHas) {
            throw Error(errorMessage)
        }
    },
    printXml: xml => console.log(util.inspect(xml, false, null)),
    writeOutputFile: async (fileName, file) => {

        const path = getFullPath(
            getRelativOutputPath(fileName)
        );
        const options = {encoding:'utf8', flag:'w'};
        await fs.writeFile(path, file, options);
    },
    getOutputFilePath: (fileName) => getFullPath(
        getFullPath(fileName)
    ),
    logSuccessBanner: () => {
        console.log(`
        ███████╗██╗   ██╗ ██████╗ ██████╗███████╗███████╗███████╗
        ██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝
        ███████╗██║   ██║██║     ██║     █████╗  ███████╗███████╗
        ╚════██║██║   ██║██║     ██║     ██╔══╝  ╚════██║╚════██║
        ███████║╚██████╔╝╚██████╗╚██████╗███████╗███████║███████║
        ╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝╚══════╝╚══════╝╚═════
    `)
    }
};
