import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphQLSchema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/', {
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    handler: async (req) => {
      const { query, variables } = req.body;
      const { prisma } = fastify;
      const { data, errors } = await graphql({
        schema: graphQLSchema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });

      return { data, errors };
    },
  });
};

export default plugin;
