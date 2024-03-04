import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';

type Subscribe = {
  subscriberId: string;
  authorId: string;
};

export interface UserSubscription extends User {
  userSubscribedTo: Subscribe[];
}

export interface SubscriptionToUser extends User {
  subscribedToUser: Subscribe[];
}

const fetchUserSubscriptions = async (prisma: PrismaClient, authorIds: string[]) => {
  const usersSubs: UserSubscription[] = await prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: {
            in: authorIds,
          },
        },
      },
    },
    include: {
      userSubscribedTo: true,
    },
  });

  return usersSubs;
};

const buildUserMap = (usersSubs: UserSubscription[]) => {
  const usersMap = new Map<string, UserSubscription[]>();

  usersSubs.forEach((sub) => {
    sub.userSubscribedTo.forEach((subscription) => {
      const authorsList = usersMap.get(subscription.authorId) || [];
      authorsList.push(sub);
      usersMap.set(subscription.authorId, authorsList);
    });
  });

  return usersMap;
};

const batchSubToUser = async (prisma: PrismaClient, keys: readonly string[]) => {
  const usersSubs = await fetchUserSubscriptions(prisma, [...keys]);
  const usersMap = buildUserMap(usersSubs);

  return keys.map((key) => usersMap.get(key) || []);
};

export const createSubToUserLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys: readonly string[]) => batchSubToUser(prisma, keys));
