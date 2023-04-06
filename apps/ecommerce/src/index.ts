import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import fs from 'node:fs';
import path from 'node:path';

import { ProductDataSource } from './data';
import { resolvers } from './resolvers';
import type { Context } from './types';

// This is the schema that describes the subgraph's API
const typeDefs = gql(
  fs.readFileSync(path.resolve(__dirname, '../schema.graphql'), {
    encoding: 'utf-8'
  })
);

async function main(): Promise<void> {
  const server = new ApolloServer<Context>({
    schema: buildSubgraphSchema({ typeDefs, resolvers })
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => ({
      dataSources: {
        products: new ProductDataSource()
      }
    }),
    listen: { 
      port: Number(process.env.PORT) || 4002 
    },
  });

  console.log(`🛍️  E-commerce subgraph ready at ${url}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
