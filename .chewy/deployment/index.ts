import * as pulumi from "@pulumi/pulumi";
import dev from "./dev";

const stackName = pulumi.getStack();

console.log("@@ stack name: ", stackName);

let devOutput: ReturnType<typeof dev> | undefined;

if(stackName === "dev") {
    console.log("@@ dev stack");
    devOutput = dev();
} else if(stackName === "prod") {
    // prod
}

export default devOutput;