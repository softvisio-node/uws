#!/usr/bin/env node

import "#core/stream";
import { resolve } from "#core/utils";
import path from "path";
import GitHubApi from "#core/api/github";
import glob from "#core/glob";
import File from "#core/file";
import fs from "fs";
import zlib from "zlib";
import env from "#core/env";

env.loadUserEnv();

const REPO = "softvisio/uws";
const TAG = "data";
const ARCHITECTURES = new Set( ["x64"] );

// find uws location
const cwd = path.dirname( resolve( "uws", import.meta.url ) );

const gitHubApi = new GitHubApi( process.env.GITHUB_TOKEN );

const release = await gitHubApi.getReleaseByTagName( REPO, TAG );
if ( !release.ok ) process.exit( 1 );

for ( const file of glob( "*.node", { cwd, "sync": true } ) ) {
    const upload = await repack( path.join( cwd, file ) );

    if ( !upload ) continue;

    const res = await gitHubApi.updateReleaseAsset( REPO, release.data.id, upload );
    if ( !res.ok ) process.exit( 1 );
}

async function repack ( _path ) {
    const [platform, arch, version] = path.basename( _path ).replace( "uws_", "" ).replace( ".node", "" ).split( "_" ),
        name = `node-v${version}-${platform}-${arch}.node.gz`;

    if ( version !== process.versions.modules || !ARCHITECTURES.has( arch ) ) return;

    return new Promise( resolve => {
        fs.createReadStream( _path )
            .pipe( zlib.createGzip() )
            .buffer()
            .then( buffer => resolve( new File( { name, buffer } ) ) );
    } );
}
