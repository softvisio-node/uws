import externalResources from "@softvisio/utils/external-resources";
import require from "./require.cjs";

const resource = await externalResources.add( `softvisio-node/uws/resources/node-v${process.versions.modules}-${process.platform}-${process.arch}.node` ).check();

export default require( resource.location + "/uws.node" );
