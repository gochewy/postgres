import * as chewy from "@gochewy/lib";
import * as docker from "@pulumi/docker";

export default function dev() {
  console.log("@@ dev stack");
  const projectConfig = chewy.project.getProjectConfig();
  const volumePath = chewy.files.getDevVolumeDir();
  const componentId = chewy.components.getComponentId();

  console.log("@@ volume path: ", volumePath);

  const image = new docker.RemoteImage(componentId, {
    name: "postgres:15.2",
  });

  const network = new docker.Network(componentId, {
    name: projectConfig.id,
  });

  const user = "user";
  const password = "password";
  const database = componentId;

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
        internal: 5432,
        external: 5432,
      },
    ],
    envs: [
      `POSTGRES_USER=${user}`,
      `POSTGRES_PASSWORD=${password}`,
      `POSTGRES_DB=${database}`,
    ],
  });

  return {
    container,
    image,
    user,
    password,
    database,
  };
}
