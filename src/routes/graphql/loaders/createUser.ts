import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';

const fetchUserData = async (
  prisma: PrismaClient,
  ids: readonly string[],
): Promise<Map<string, User | null>> => {
  const users = await prisma.user.findMany({
    where: { id: { in: [...ids] } },
  });

  const usersMap = new Map<string, User | null>();
  ids.forEach((id) => {
    const user = users.find((u) => u.id === id) || null;
    usersMap.set(id, user);
  });

  return usersMap;
};

const batchUserDataLoader = (prisma: PrismaClient) => async (keys: readonly string[]) => {
  const usersMap = await fetchUserData(prisma, keys);

  return keys.map((key) => usersMap.get(key));
};

export const createUserLoader = (prisma: PrismaClient) =>
  new DataLoader(batchUserDataLoader(prisma));
