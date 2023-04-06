import type { QueryResolvers, TopProducts } from 'graph';
import { blockResolver } from './block';
import type { Context } from '../types';

/**
 * Resolver for the topProducts query.
 */
export const topProductsResolver: QueryResolvers<Context>['topProducts'] =
  async (parent, _, context, info) => {
    // this block can always be found, so we can safely cast it to TopProducts
    const block = (await blockResolver(
      parent,
      { slug: 'top-products' },
      context,
      info
    )) as TopProducts;

    return {
      ...block,
      products: []
    };
  };
