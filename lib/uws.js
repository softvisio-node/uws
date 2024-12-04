import externalResources from "@softvisio/utils/external-resources";
import { require } from "@softvisio/utils/utils";

const resource = await externalResources
    .add( {
        "id": "softvisio-node/uws",
        "node": true,
    } )
    .check();

export default require( resource.getResourcePath( "uws.node" ) );
