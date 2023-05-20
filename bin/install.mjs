#!/usr/bin/env node

import fs from "node:fs";
import stream from "node:stream";
import zlib from "node:zlib";

const url = new URL( "https://github.com/softvisio-node/uws/releases/download/data/" );

await get( url, `node-v${process.versions.modules}-${process.platform}-${process.arch}.node` );

// under windows download linux binaries for vmware
if ( process.platform === "win32" ) {
    await get( url, `node-v${process.versions.modules}-linux-${process.arch}.node` );
}

async function get ( url, file ) {
    process.stdout.write( `Downloading: ${file} ... ` );

    const res = await fetch( url + file + ".gz" );

    if ( !res.ok ) {
        console.log( "FAILED" );

        process.exit( 1 );
    }
    else {
        fs.mkdirSync( "lib/binaries", { "recursive": true } );

        await stream.compose( stream.Readable.fromWeb( res.body ), zlib.createGunzip(), fs.createWriteStream( `lib/binaries/${file}` ) );

        console.log( "OK" );
    }
}
