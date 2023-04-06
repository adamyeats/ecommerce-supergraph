/**
 * This script copies all schema.graphql files from the apps folder to the tmp folder.
 * This is needed for the Docker image to be able to build the supergraph schema.
 */

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dir = path.dirname(filename);
const appsDir = path.join(dir, '../../../apps');

// Read all folders in apps directory
const files = await fs.readdir(appsDir, { withFileTypes: true });

// Loop through all folders and copy schema.graphql file to tmp folder
await Promise.all(
  files.map(async (dirent) => {
    if (dirent.isDirectory()) {
      const folderName = dirent.name;
      const schemaPath = path.join(appsDir, folderName, 'schema.graphql');

      // Check if schema.graphql file exists in the current folder
      if (existsSync(schemaPath)) {
        const newFileName = `${folderName}.graphql`;
        const newFilePath = path.join(dir, '../../../packages/graph/tmp', newFileName);

        // Copy and rename schema.graphql file to folderName.graphql
        await fs.copyFile(schemaPath, newFilePath);
      }
    }
  })
);

console.log('✅ All schema files copied. You can now build the Docker image.');
