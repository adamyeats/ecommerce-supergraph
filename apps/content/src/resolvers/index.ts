import { blockResolver, blocksResolver } from './block';
import { topProductsResolver } from './top-products';

import type { Resolvers } from 'graph';
import type { Context } from '../types';

export const resolvers: Resolvers<Context> = {
  ContentBlock: {
    __resolveType(block) {
      if (block.products) {
        return 'TopProducts';
      }

      return null;
    }
  },
  Query: {
    block: blockResolver,
    blocks: blocksResolver,
    topProducts: topProductsResolver
  }
};
