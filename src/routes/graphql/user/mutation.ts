import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Environment } from '../types/environment.js';
import { UUIDType } from '../types/uuid.js';
import { UserType } from './type.js';
import {
  ChangeUserInputType,
  CreateUserInputType,
  UserSubscriptionType,
} from '../types/input.js';
import { Prisma } from '@prisma/client';

const userInputFields = {
  name: { type: GraphQLString },
  balance: { type: GraphQLFloat },
};

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({ ...userInputFields }),
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({ ...userInputFields }),
});

const createUser = async (
  _: unknown,
  { dto }: { dto: CreateUserInputType },
  { prisma }: Environment,
) => await prisma.user.create({ data: dto as unknown as Prisma.UserCreateInput });

const changeUser = async (
  _: unknown,
  { id, dto }: { id: string; dto: ChangeUserInputType },
  { prisma }: Environment,
) => await prisma.user.update({ where: { id }, data: dto as Prisma.UserUpdateInput });

const deleteUser = async (
  _: unknown,
  { id }: { id: string },
  { prisma }: Environment,
) => {
  await prisma.user.delete({ where: { id } });
  return id;
};

const subscribeTo = async (
  _: unknown,
  { userId, authorId }: UserSubscriptionType,
  { prisma }: Environment,
) =>
  await prisma.user.update({
    where: { id: userId },
    data: { userSubscribedTo: { create: { authorId } } },
  });

const unsubscribeFrom = async (
  _: unknown,
  { userId, authorId }: UserSubscriptionType,
  { prisma }: Environment,
) => {
  await prisma.subscribersOnAuthors.delete({
    where: {
      subscriberId_authorId: {
        subscriberId: userId,
        authorId,
      },
    },
  });
  return userId;
};

export const UserMutations = {
  createUser: {
    type: UserType as GraphQLObjectType,
    args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
    resolve: createUser,
  },
  changeUser: {
    type: UserType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeUserInput) },
    },
    resolve: changeUser,
  },
  deleteUser: {
    type: UUIDType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: deleteUser,
  },
  subscribeTo: {
    type: UserType as GraphQLObjectType,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: subscribeTo,
  },
  unsubscribeFrom: {
    type: UUIDType,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: unsubscribeFrom,
  },
};
