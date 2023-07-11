#!/usr/bin/env node

import { resolve } from "#core/utils";
import glob from "#core/glob";
import fs from "node:fs";
import path from "node:path";
import ExternalResourcesBuilder from "#core/external-resources/builder";
import { readConfig } from "#core/config";

const id = "softvisio-node/uws/resources";

// find uws location
const cwd = path.dirname( resolve( "uws", import.meta.url ) );

const meta = { "version": readConfig( cwd + "/package.json" ).version };

var name;

class ExternalResource extends ExternalResourcesBuilder {
    #file;

    constructor ( file, name1 ) {
        super();

        this.#file = file;
        name = name1;
    }

    get id () {
        return id + "/" + name;
    }

    // XXX
    async _getEtag () {
        return result( 200, new Date() );
    }

    async _build ( location ) {
        fs.copyFileSync( this.#file, location + "/" + name );

        return result( 200 );
    }

    async _getMeta () {
        return meta;
    }
}

const ARCHITECTURES = new Set( ["x64"] );

for ( const file of glob( "*.node", { cwd } ) ) {
    const [platform, arch, version] = path.basename( file ).replace( "uws_", "" ).replace( ".node", "" ).split( "_" );

    if ( version !== process.versions.modules || !ARCHITECTURES.has( arch ) ) continue;

    const name = `node-v${version}-${platform}-${arch}.node`;

    const resource = new ExternalResource( cwd + "/" + file, name );

    const res = await resource.build();

    if ( !res.ok ) process.exit( 1 );
}
