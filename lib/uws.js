import externalResources from "@softvisio/utils/external-resources";
import require from "./require.cjs";

const resource = await externalResources
    .add( {
        "id": "softvisio-node/uws",
        "node": true,
    } )
    .check();

export default require( resource.location + "/uws.node" );
