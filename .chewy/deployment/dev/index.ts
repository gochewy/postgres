import * as chewy from "@gochewy/lib";
import * as docker from "@pulumi/docker";
import ComponentOutput from "../component-output";

export default function dev() {
  const projectConfig = chewy.project.getProjectConfig();
  const volumePath = chewy.files.getDevVolumeDir();
  const componentId = chewy.components.getComponentId();

  const image = new docker.RemoteImage(componentId, {
    name: "postgres:15.2",
  });

  const network = new docker.Network(componentId, {
    name: projectConfig.id,
  });

  const user = "user";
  const password = "password";
  const database = componentId;
  const port = 5432;

  const container = new docker.Container(componentId, {
    name: componentId,
    image: image.name,
    networksAdvanced: [
      {
        name: projectConfig.id,
      },
    ],
    restart: "unless-stopped",
    volumes: [
      {
        containerPath: "/var/lib/postgresql/data",
        hostPath: volumePath,
      },
    ],
    ports: [
      {
        internal: port,
        external: port,
      },
    ],
    envs: [
      `POSTGRES_USER=${user}`,
      `POSTGRES_PASSWORD=${password}`,
      `POSTGRES_DB=${database}`,
    ],
  });

  const output: ComponentOutput = {
    username: user,
    password: password,
    publicHost: null,
    publicPort: port,
    privateHost: container.name,
    privatePort: port,
    database: database,
  }

  return output;
}
