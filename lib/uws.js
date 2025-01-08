import externalResources from "@softvisio/utils/external-resources";
import { require } from "@softvisio/utils/utils";

const resource = await externalResources
    .add(
        {
            "id": "softvisio-node/uws",
            "node": true,
            "caller": import.meta.url,
        },
        {
            "autoUpdate": false,
        }
    )
    .check();

export default require( resource.getResourcePath( "uws.node" ) );
