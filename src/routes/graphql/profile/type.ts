import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberType, MemberTypeIdGQLEnum } from '../member/type.js';
import { Profile } from '@prisma/client';
import { Environment } from '../types/environment.js';

const resolveMemberType = async (
  profile: Profile,
  _: unknown,
  { loaders }: Environment,
) => {
  const { memberTypeLoader } = loaders;
  return memberTypeLoader.load(profile.memberTypeId);
};

export const ProfileType = new GraphQLObjectType<Profile, Environment>({
  name: 'Profile',
  description: 'Profile data',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdGQLEnum },

    memberType: {
      type: MemberType as GraphQLObjectType,
      resolve: resolveMemberType,
    },
  }),
});
