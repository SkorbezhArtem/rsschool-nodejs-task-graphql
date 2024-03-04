import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Environment } from '../types/environment.js';
import { UserType } from './type.js';
import { SubscriptionToUser, UserSubscription } from '../types/userSub.js';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

const resolveUsers = async (
  _: unknown,
  __: unknown,
  { prisma, loaders }: Environment,
  info: GraphQLResolveInfo,
) => {
  const parsedData = parseResolveInfo(info) as ResolveTree;
  const { userSubscribedToLoader, subscribedToUser } = loaders;
  const { returnType } = info;
  const { fields } = simplifyParsedResolveInfoFragmentWithType(parsedData, returnType);

  const subs = 'subscribedToUser' in fields;
  const userSubs = 'userSubscribedTo' in fields;

  const users = await prisma.user.findMany({
    include: {
      subscribedToUser: subs,
      userSubscribedTo: userSubs,
    },
  });

  if (subs || userSubs) {
    const userMap = new Map<string, UserSubscription | SubscriptionToUser>(
      users.map((user) => [user.id, user]),
    );
    users.forEach((user) => {
      if (subs) {
        subscribedToUser.prime(
          user.id,
          user.subscribedToUser.map(
            ({ subscriberId }) => userMap.get(subscriberId) as UserSubscription,
          ),
        );
      }
      if (userSubs) {
        userSubscribedToLoader.prime(
          user.id,
          user.userSubscribedTo.map(
            ({ authorId }) => userMap.get(authorId) as SubscriptionToUser,
          ),
        );
      }
    });
  }
  return users;
};

const users = {
  type: new GraphQLList(UserType),
  resolve: resolveUsers,
};

const user = {
  type: UserType as GraphQLObjectType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_: unknown, { id }: { id: string }, { prisma }: Environment) =>
    await prisma.user.findUnique({ where: { id } }),
};

export const UserRequest = {
  users,
  user,
};
