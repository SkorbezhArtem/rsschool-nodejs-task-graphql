import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFieldResolver,
} from 'graphql';
import { MemberType, MemberTypeIdGQLEnum } from './type.js';
import { Environment } from '../types/environment.js';
import { MemberType as MemberTypePrisma } from '@prisma/client';

const getMemberTypes: GraphQLFieldResolver<unknown, Environment> = async (
  _source,
  _args,
  { prisma }: Environment,
) => {
  return await prisma.memberType.findMany();
};

const getMemberType: GraphQLFieldResolver<unknown, Environment> = async (
  _source,
  { id }: MemberTypePrisma,
  { prisma }: Environment,
) => {
  return await prisma.memberType.findUnique({ where: { id } });
};

export const MemberRequest = {
  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: getMemberTypes,
  },
  memberType: {
    type: MemberType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(MemberTypeIdGQLEnum) },
    },
    resolve: getMemberType,
  },
};
