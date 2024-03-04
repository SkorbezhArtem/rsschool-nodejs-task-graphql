import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from '../profile/type.js';
import { Environment } from '../types/environment.js';
import { User } from '@prisma/client';
import { PostType } from '../post/type.js';

const resolvePosts = async (
  { id }: User,
  _: unknown,
  { loaders: { postsLoader } }: Environment,
) => postsLoader.load(id);

const resolveProfile = async (
  { id }: User,
  _: unknown,
  { loaders: { profileLoader } }: Environment,
) => profileLoader.load(id);

const resolveSubscribedToUser = async (
  { id }: User,
  _: unknown,
  { loaders: { subscribedToUser } }: Environment,
) => subscribedToUser.load(id);

const resolveUserSubscribedTo = async (
  { id }: User,
  _: unknown,
  { loaders: { userSubscribedToLoader } }: Environment,
) => userSubscribedToLoader.load(id);

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User data',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    posts: {
      type: new GraphQLList(PostType),
      resolve: resolvePosts,
    },
    profile: {
      type: ProfileType as GraphQLObjectType,
      resolve: resolveProfile,
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: resolveSubscribedToUser,
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: resolveUserSubscribedTo,
    },
  }),
});
