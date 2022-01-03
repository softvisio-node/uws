#!/usr/bin/env node

import "#core/stream";
import { resolve } from "#core/utils";
import path from "path";
import GitHubApi from "#core/api/github";
import glob from "#core/glob";
import File from "#core/file";
import fs from "fs";
import zlib from "zlib";

const REPO = "softvisio/uws";
const TAG = "data";

// find uws location
const cwd = path.dirname( resolve( "uws/package.json", import.meta.url ) );

const gitHubApi = new GitHubApi( process.env.GITHUB_TOKEN );

const release = await gitHubApi.getReleaseByTagName( REPO, TAG );
if ( !release.ok ) process.exit( 1 );

for ( const file of glob( "*.node", { cwd, "sync": true } ) ) {
    const res = await gitHubApi.updateReleaseAsset( REPO, release.data.id, await repack( path.join( cwd, file ) ) );
    if ( !res.ok ) process.exit( 1 );
}

async function repack ( _path ) {
    const [platform, arch, version] = path.basename( _path ).replace( "uws_", "" ).replace( ".node", "" ).split( "_" ),
        name = `node-v${version}-${platform}-${arch}.node`;

    return new Promise( resolve => {
        fs.createReadStream( _path )
            .pipe( zlib.createGzip() )
            .buffer( buffer => resolve( new File( { name, "content": buffer } ) ) );
    } );
}
