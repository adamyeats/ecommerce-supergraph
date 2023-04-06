/**
 * This script generates the supergraph config for local development and
 * docker development. It is run as a postinstall script in the graph
 * package.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document } from 'yaml';

const CONFIG_TEMPLATE = {
  federation_version: "=2.3.1",
  subgraphs: {}
}

/**
 * Get the names of the folders in a directory.
 */
async function getDirectoryNames(directoryPath) {
  const files = await fs.readdir(directoryPath);

  return Promise.all(
    files.filter(async (file) => {
      const stat = await fs.stat(path.join(directoryPath, file));
      return stat.isDirectory();
    })
  );
}

/**
 * Create the supergraph config for local development.
 */
function createLocalConfig(names) {
  const subgraphs = names.reduce((prev, name, i) => ({
    ...prev,
    [name]: {
      // This is a kind of wonky way to do this, but it works for now. It
      // assumes that the apps are running on ports 4001, 4002, etc. depending
      // on the order they appear in the /apps directory.
      routing_url: `http://localhost:400${i + 1}`,
      schema: {
        file: `../../../apps/${name}/schema.graphql`
      }
    }
  }), {});

  return new Document({ ...CONFIG_TEMPLATE, subgraphs }).toString();
}

/**
 * Create the supergraph config for docker development.
 */
function createDockerConfig(names) {
  const subgraphs = names.reduce((prev, name) => ({
    ...prev,
    [name]: {
      routing_url: `http://${name}:4000`,
      schema: {
        file: `${name}.graphql`
      }
    }
  }), {});

  return new Document({ ...CONFIG_TEMPLATE, subgraphs }).toString();
}

try {
  const filename = fileURLToPath(import.meta.url);
  const dir = path.dirname(filename);

  const paths = {
    apps: path.resolve(dir, '../../../apps'),
    config: {
      local: path.resolve(dir, '../config/supergraph.yaml'),
      docker: path.resolve(dir, '../tmp/supergraph-docker.yaml')
    }
  }

  const names = await getDirectoryNames(paths.apps);

  await Promise.all([
    fs.writeFile(paths.config.local, createLocalConfig(names)),
    fs.writeFile(paths.config.docker, createDockerConfig(names))
  ]);

  console.log('✅ Rover config generated.');
} catch (err) {
  console.log('Error getting directory information.', err);
}
