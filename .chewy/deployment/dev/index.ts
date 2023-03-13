import * as docker from '@pulumi/docker';
import * as chewy from '@gochewy/lib';

const projectConfig = chewy.project.getProjectConfig();
const componentConfig = chewy.components.getInstalledComponentDefinition();
const name = componentConfig.name;

const image = new docker.Image(name, {
    imageName: 'postgres:latest',
});

const container = new docker.Container(name, {
    image: image.imageName.get() as string,
    networksAdvanced: [{
        name: projectConfig.id,
    }],
    restart: 'unless-stopped',
    volumes: [{
        hostPath: '/var/lib/postgresql/data',
    }]
});