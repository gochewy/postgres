import * as chewy from '@gochewy/lib';
import * as pulumi from "@pulumi/pulumi";
import ComponentOutput from "./component-output";
import dev from "./dev";

export = async () => {
  let output: ComponentOutput;
  const stackName = pulumi.getStack();

  const environment = stackName.split('--')[0]

  const graph = chewy.project.getDependencyGraph(environment)

  const componentName = chewy.components.getComponentName();

  if(!componentName) {
    throw new Error('Could not find component name')
  }

  const deployedId = chewy.components.getDeployedComponentId({name: componentName}, environment)

  // get infra dependency
  const infraDepIds = graph.dependenciesOf(deployedId)
    .filter(depedency => {
      const nodeData = graph.getNodeData(depedency)
      return nodeData.type === chewy.config.component.componentTypeSchema.Values.infrastructure
    })

  if(infraDepIds.length > 1) {
    throw new Error('More than one infra dependency found')
  }
  if(infraDepIds.length === 0) {
    throw new Error('No infra dependency found')
  }
  
  const infraDep = graph.getNodeData(infraDepIds[0])

  if(infraDep.definition.name === 'docker-development-host') {
    return dev();
  }
};
