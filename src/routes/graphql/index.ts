import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphQLSchema } from './schemas.js';
import { GraphQLError, graphql, parse, validate, Source } from 'graphql';
import { getDataLoaders } from './loaders/loader.js';
import depthLimit from 'graphql-depth-limit';

interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { prisma } = fastify;
      const { query, variables }: GraphQLRequest = req.body;
      const loaders = getDataLoaders(prisma);

      try {
        const validationErrors = validate(graphQLSchema, parse(new Source(query)), [
          depthLimit(5),
        ]);

        if (validationErrors.length) {
          console.log('Maximum depth: 5');
          return { errors: validationErrors };
        }

        const { data, errors } = await graphql({
          schema: graphQLSchema,
          source: new Source(query),
          variableValues: variables,
          contextValue: { prisma, loaders },
        });

        return { data, errors };
      } catch (e) {
        handleGraphQLError(e as Error);
        return { errors: [e] };
      }
    },
  });

  function handleGraphQLError(error: Error) {
    if (error instanceof GraphQLError) {
      console.log('Error GQL request:', error.message);
    }
  }
};

export default plugin;
