import * as chewy from '@gochewy/lib';
import * as pulumi from "@pulumi/pulumi";
import ComponentOutput from "./component-output";
import dev from "./dev";

export = async (): Promise<ComponentOutput | undefined> => {
  const stackName = pulumi.getStack();
  const infraDep = chewy.components.getInfraTarget({deployedComponentId: stackName});

  if(infraDep.definition.name === 'docker-development-host') {
    return dev();
  }
};
