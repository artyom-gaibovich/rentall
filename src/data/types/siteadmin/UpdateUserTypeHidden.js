import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';

const UpdateUserTypeHidden = new ObjectType({
  name: 'UpdateUserHidden',
  fields: {
    profileId: { type: IntType },
    firstName: { type: StringType },
    lastName: { type: StringType },
    phoneNumber: { type: StringType },
    email: { type: StringType },

  },
});

export default UpdateUserTypeHidden;
