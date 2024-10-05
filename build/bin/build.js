#!/usr/bin/env node

import path from "node:path";
import Cli from "#core/cli";
import { readConfig } from "#core/config";
import ExternalResourceBuilder from "#core/external-resource-builder";
import glob from "#core/glob";
import { resolve } from "#core/utils";
import Uws from "#lib/uws";

const ARCHITECTURES = new Set( [ "x64" ] );

const CLI = {
    "title": "Update resources",
    "options": {
        "force": {
            "description": "Force build",
            "default": false,
            "schema": {
                "type": "boolean",
            },
        },
    },
};

await Cli.parse( CLI );

// find uws location
const cwd = path.dirname( resolve( "uws", import.meta.url ) );

const meta = { "uws": "v" + readConfig( cwd + "/package.json" ).version };

const resources = [];

for ( const file of glob( "*.node", { cwd } ) ) {
    const [ platform, architecture, node ] = path.basename( file ).replace( "uws_", "" ).replace( ".node", "" ).split( "_" );

    if ( !ARCHITECTURES.has( architecture ) ) continue;

    const resource = new Uws(
        cwd + "/" + file,
        {
            node,
            platform,
            architecture,
        },
        meta
    );

    resources.push( resource );
}

if ( resources.length ) {
    const res = await ExternalResourceBuilder.build( resources, { "force": process.cli.options.force } );

    if ( !res.ok ) process.exit( 1 );
}
