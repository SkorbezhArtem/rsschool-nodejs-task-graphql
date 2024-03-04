import { MemberTypeId } from '../../member-types/schemas.js';
import { ProfileType } from '../profile/type.js';
import { Environment } from '../types/environment.js';
import { MemberType as MemberTypePrisma } from '@prisma/client';
import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFieldResolver,
} from 'graphql';

export const MemberTypeIdGQLEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

const getProfiles: GraphQLFieldResolver<MemberTypePrisma, Environment> = async (
  { id }: MemberTypePrisma,
  _args,
  { prisma }: Environment,
) => {
  return await prisma.profile.findMany({ where: { memberTypeId: id } });
};

export const MemberType = new GraphQLObjectType<MemberTypePrisma, Environment>({
  name: 'MemberType',
  description: 'MemberType data',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdGQLEnum) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: getProfiles,
    },
  }),
});
