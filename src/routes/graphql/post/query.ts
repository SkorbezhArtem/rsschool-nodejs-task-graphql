import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Post } from '@prisma/client';
import { Environment } from '../types/environment.js';
import { UUIDType } from '../types/uuid.js';
import { PostType } from './type.js';

const getPostsResolver = async (_: unknown, __: unknown, { prisma }: Environment) =>
  await prisma.post.findMany();

const getPostResolver = async (_: unknown, { id }: Post, { prisma }: Environment) =>
  await prisma.post.findUnique({ where: { id } });

export const PostRequest = {
  posts: {
    type: new GraphQLList(PostType),
    resolve: getPostsResolver,
  },

  post: {
    type: PostType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: getPostResolver,
  },
};
