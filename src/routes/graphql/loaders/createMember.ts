import { MemberType, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

interface BatchMemberTypeDataLoaderParams {
  prisma: PrismaClient;
}

const batchMemberTypeDataLoader =
  ({ prisma }: BatchMemberTypeDataLoaderParams) =>
  async (keys: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: keys as string[] } as { in: string[] } },
    });

    const memberTypeMap = new Map<string, MemberType>();
    memberTypes.forEach((memberType) => {
      memberTypeMap.set(memberType.id, memberType);
    });

    return keys.map((key) => memberTypeMap.get(key));
  };

export const createMemberTypeLoader = (prisma: PrismaClient) =>
  new DataLoader(batchMemberTypeDataLoader({ prisma }));
