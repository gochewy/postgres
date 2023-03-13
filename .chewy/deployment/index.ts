import * as pulumi from "@pulumi/pulumi";

const stackName = pulumi.getStack();

let exported: any;

if(stackName === "dev") {
    exported = require("./dev");
} else if(stackName === "prod") {
    // prod
}

export default exported;