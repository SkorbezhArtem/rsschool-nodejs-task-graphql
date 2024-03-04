import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../user/type.js';
import { Post } from '@prisma/client';
import { Environment } from '../types/environment.js';

const resolveAuthor = async ({ authorId }: Post, _: unknown, { prisma }: Environment) =>
  prisma.user.findUnique({ where: { id: authorId } });

export const PostType = new GraphQLObjectType<Post, Environment>({
  name: 'Post',
  description: 'Post data',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: UserType as GraphQLObjectType,
      resolve: resolveAuthor,
    },
  }),
});
