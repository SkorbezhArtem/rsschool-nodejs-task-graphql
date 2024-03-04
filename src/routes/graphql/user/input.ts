import {
  GraphQLFloat,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';

const userFields = {
  name: { type: GraphQLString },
  balance: { type: GraphQLFloat },
};

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    ...userFields,
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: userFields,
});

export { CreateUserInput, ChangeUserInput };
