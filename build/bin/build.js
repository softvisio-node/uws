#!/usr/bin/env node

import { resolve } from "#core/utils";
import glob from "#core/glob";
import fs from "node:fs";
import path from "node:path";
import ExternalResourcesBuilder from "#core/external-resources/builder";

const id = "softvisio-node/uws/resources";

class ExternalResource extends ExternalResourcesBuilder {
    #file;
    #name;

    constructor ( file, name ) {
        super();

        this.#file = file;
        this.#name = name;
    }

    get id () {
        return id + "/" + this.#name;
    }

    // XXX
    async _getEtag () {
        return result( 200, new Date() );
    }

    async _build ( location ) {
        fs.cpSync( this.#file, location + "/" + this.#name );

        return result( 200 );
    }

    // XXX
    async _getMeta () {}
}

const ARCHITECTURES = new Set( ["x64"] );

// find uws location
const cwd = path.dirname( resolve( "uws", import.meta.url ) );

for ( const file of glob( "*.node", { cwd } ) ) {
    const [platform, arch, version] = path.basename( file ).replace( "uws_", "" ).replace( ".node", "" ).split( "_" );

    if ( version !== process.versions.modules || !ARCHITECTURES.has( arch ) ) continue;

    const name = `node-v${version}-${platform}-${arch}.node`;

    const resource = new ExternalResource( cwd + "/" + file, name );

    const res = await resource.build();

    if ( !res.ok ) process.exit( 1 );
}
