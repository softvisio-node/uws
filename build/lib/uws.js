import ExternalResourceBuilder from "#core/external-resource-builder";
import fs from "node:fs";

export default class ExternalResource extends ExternalResourceBuilder {
    #file;
    #name;
    #meta;

    constructor ( file, name, meta ) {
        super( ["softvisio-node/uws/resources", name] );

        this.#file = file;
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
