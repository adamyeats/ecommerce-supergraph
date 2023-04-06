import type { Resolvers } from 'graph';
import type { Context } from '../types';
import { GraphQLError } from 'graphql';

/**
 * Resolvers for the Product type.
 */
export const resolvers: Resolvers<Context> = {
  Query: {
    async product(_, { sku }, { dataSources }) {
      const product = await dataSources.products.getProduct(sku);

      if (!product) {
        throw new GraphQLError('Product not found.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'sku'
          }
        });
      }

      return product;
    },
    products(_, { limit, offset }, { dataSources }) {
      if (!!limit) {
        return dataSources.products.getProducts({ limit, offset });
      } else {
        return dataSources.products.getAllProducts();
      }
    }
  },
  TopProducts: {
    products(_, { limit }, { dataSources }) {
      return dataSources.products.getTopProducts(limit);
    }
  }
};
