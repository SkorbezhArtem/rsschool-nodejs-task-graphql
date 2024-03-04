import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from './type.js';
import { Environment } from '../types/environment.js';
import { Profile } from '@prisma/client';

const getProfilesResolver = async (_: unknown, __: unknown, { prisma }: Environment) =>
  await prisma.profile.findMany();

const getProfileResolver = async (_: unknown, { id }: Profile, { prisma }: Environment) =>
  await prisma.profile.findUnique({ where: { id } });

export const ProfileRequest = {
  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: getProfilesResolver,
  },

  profile: {
    type: ProfileType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: getProfileResolver,
  },
};
