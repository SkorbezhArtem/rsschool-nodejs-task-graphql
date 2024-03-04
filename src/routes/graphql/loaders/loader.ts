import { PrismaClient } from '@prisma/client';
import { createProfileLoader } from './createProfile.js';
import { createPostsLoader } from './createPost.js';
import { createUserToSubLoader } from './createUserToSub.js';
import { createUserLoader } from './createUser.js';
import { createMemberTypeLoader } from './createMember.js';
import { createSubToUserLoader } from './createSubToUser.js';

export const getDataLoaders = (prisma: PrismaClient) => ({
  memberTypeLoader: createMemberTypeLoader(prisma),
  postsLoader: createPostsLoader(prisma),
  profileLoader: createProfileLoader(prisma),
  userLoader: createUserLoader(prisma),
  subscribedToUser: createSubToUserLoader(prisma),
  userSubscribedToLoader: createUserToSubLoader(prisma),
});
