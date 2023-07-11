const externalResources = require( "@softvisio/external-resources" );
const url = require( "node:url" );

const resource = externalResources.add( `softvisio-node/uws/resources/node-v${process.versions.modules}-${process.platform}-${process.arch}.node`, url.pathToFileURL( __filename ), { "location": "lib/binaries" } );

module.exports = require( resource.location + "/" + `node-v${process.versions.modules}-${process.platform}-${process.arch}.node` );
