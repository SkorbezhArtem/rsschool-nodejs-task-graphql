import { Post, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

interface BatchPostDataLoaderParams {
  prisma: PrismaClient;
}

const batchPostDataLoader =
  ({ prisma }: BatchPostDataLoaderParams) =>
  async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: [...authorIds] } },
    });

    const postsMap = posts.reduce((acc, post) => {
      const authorPosts = acc.get(post.authorId) || [];
      return acc.set(post.authorId, [...authorPosts, post]);
    }, new Map<string, Post[]>());

    return authorIds.map((authorId) => postsMap.get(authorId) || []);
  };

export const createPostsLoader = (prisma: PrismaClient) =>
  new DataLoader(batchPostDataLoader({ prisma }));
