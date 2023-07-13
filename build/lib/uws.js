import ExternalResourceBuilder from "#core/external-resource-builder";
import fs from "node:fs";

const id = "softvisio-node/uws/resources";

export default class ExternalResource extends ExternalResourceBuilder {
    #file;
    #name;
    #meta;

    constructor ( file, name, meta ) {
        super( id + "/" + name );

        this.#file = file;
        this.#name = name;
        this.#meta = meta;
    }

    async _getEtag () {
        return result( 200, await this._getFileHash( this.#file ) );
    }

    async _build ( location ) {
        fs.copyFileSync( this.#file, location + "/uws.node" );

        return result( 200 );
    }

    async _getMeta () {
        return this.#meta;
    }
}
