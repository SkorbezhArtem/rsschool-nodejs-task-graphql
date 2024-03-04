import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { PostType } from './type.js';
import {
  ChangePostInputType,
  CreatePostInputType,
  DeletePostInputType,
} from '../types/input.js';
import { Environment } from '../types/environment.js';

const commonPostInputFields = {
  authorId: { type: UUIDType },
  content: { type: GraphQLString },
  title: { type: GraphQLString },
};

const createPostResolver = async (
  _: unknown,
  { dto }: CreatePostInputType,
  { prisma }: Environment,
) => await prisma.post.create({ data: dto });

const updatePostResolver = async (
  _: unknown,
  { id, dto }: ChangePostInputType,
  { prisma }: Environment,
) => await prisma.post.update({ where: { id }, data: dto });

const deletePostResolver = async (
  _: unknown,
  { id }: DeletePostInputType,
  { prisma }: Environment,
) => {
  await prisma.post.delete({ where: { id } });
  return id;
};

export const PostMutations = {
  createPost: {
    type: PostType as GraphQLObjectType,
    args: {
      dto: {
        type: new GraphQLNonNull(
          new GraphQLInputObjectType({
            name: 'CreatePostInput',
            fields: commonPostInputFields,
          }),
        ),
      },
    },
    resolve: createPostResolver,
  },

  changePost: {
    type: PostType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: {
        type: new GraphQLInputObjectType({
          name: 'ChangePostInput',
          fields: commonPostInputFields,
        }),
      },
    },
    resolve: updatePostResolver,
  },

  deletePost: {
    type: UUIDType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: deletePostResolver,
  },
};
