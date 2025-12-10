import externalResources from "@c0rejs/utils/external-resources";
import { require } from "@c0rejs/utils/utils";

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
