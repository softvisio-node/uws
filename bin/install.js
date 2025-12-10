#!/usr/bin/env node

import externalResources from "@c0rejs/utils/external-resources";

externalResources.add( {
    "id": "c0rejs/uws",
    "node": true,
    "caller": import.meta.url,
} );

const res = await externalResources.install( {
    "force": false,
} );

if ( !res.ok ) process.exit( 1 );
