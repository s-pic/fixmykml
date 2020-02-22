const { promisify } = require('util');
const { Parser, Builder } = require('xml2js');
const xmlParseOpts = {explicitArray: false};
const parser = new Parser(xmlParseOpts);
const builder = new Builder(xmlParseOpts);
module.exports = {
    parse: promisify(parser.parseString),
    build: builder.buildObject.bind(builder)
}

