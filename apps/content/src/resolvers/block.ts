import { GraphQLError } from 'graphql';
import type { QueryResolvers } from 'graph';
import type { Context } from '../types';

/**
 * Resolver for a single ContentBlock.
 */
export const blockResolver: Extract<
  QueryResolvers<Context>['block'],
  Function
> = async (_, { slug }, { dataSources }) => {
  const block = await dataSources.blocks.getBlockFor(slug);

  if (!block) {
    throw new GraphQLError('Content block not found. Has it been created?', {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName: 'slug'
      }
    });
  }

  return block;
};

/**
 * Resolver for multiple ContentBlocks.
 */
export const blocksResolver: QueryResolvers<Context>['blocks'] = (
  _,
  __,
  { dataSources }
) => {
  return dataSources.blocks.getAllBlocks();
};
