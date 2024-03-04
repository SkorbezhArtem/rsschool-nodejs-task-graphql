import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphQLSchema } from './schemas.js';
import { GraphQLError, graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

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
      const { query, variables } = req.body;
      const { prisma } = fastify;

      try {
        const validationErrors = validate(graphQLSchema, parse(query), [depthLimit(5)]);

        if (validationErrors.length) {
          console.log('Maximum depth exceeded: 5');
          return { errors: validationErrors };
        }

        const { data, errors } = await graphql({
          schema: graphQLSchema,
          source: query,
          variableValues: variables,
          contextValue: {
            prisma,
          },
        });

        return { data, errors };
      } catch (error) {
        if (error instanceof GraphQLError) {
          console.log('GraphQL Error:', error.message);
        }

        return { errors: [error] };
      }
    },
  });
};

export default plugin;
