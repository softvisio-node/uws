const externalResources = require( "@softvisio/external-resources" );

const resource = externalResources.add( `softvisio-node/uws/resources/node-v${process.versions.modules}-${process.platform}-${process.arch}.node`, { "location": "lib/binaries", "resolve": __filename } );

module.exports = require( resource.location + "/uws.node" );
