import DataLoader from 'dataloader';
import { SubscriptionToUser, UserSubscription } from '../types/userSub.js';
import { MemberType, User, Profile, Post } from '@prisma/client';

export type DataLoaders = {
  memberTypeLoader: DataLoader<string, MemberType | undefined, string>;
  postsLoader: DataLoader<string, Post[], string>;
  profileLoader: DataLoader<string, Profile | undefined, string>;
  userLoader: DataLoader<string, User | undefined, string>;
  subscribedToUser: DataLoader<string, UserSubscription[], string>;
  userSubscribedToLoader: DataLoader<string, SubscriptionToUser[], string>;
};
