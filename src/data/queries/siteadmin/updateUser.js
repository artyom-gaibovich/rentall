import UpdateUserType from '../../types/siteadmin/UpdateUserType';
import { UserProfile } from '../../../data/models';

import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const updateUser = {

  type: UpdateUserType,

  args: {
    profileId: { type: new NonNull(IntType) },
    firstName: { type: StringType },
    lastName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    phoneNumber: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
  },

  async resolve({ request }, {
    profileId,
    firstName,
    lastName,
    gender,
    dateOfBirth,
    phoneNumber,
    preferredLanguage,
    preferredCurrency,
    location,
    info,
  },
  ) {
    if (request.user && request.user.admin == true) {
      let isUserUpdated = false;

      // Get All User Profile Data
      const updateData = await UserProfile.update(
        {
          firstName,
          lastName,
          gender,
          dateOfBirth,
          phoneNumber,
          preferredLanguage,
          preferredCurrency,
          location,
          info,
        },
        {
          where: {
            profileId,
          },
        },
      )
        .then((instance) => {
          // Check if any rows are affected
          if (instance > 0) {
            isUserUpdated = true;
          }
        });

      if (isUserUpdated) {
        return {
          status: 'success',
        };
      }
      return {
        status: 'failed',
      };
    }
    return {
      status: 'failed',
    };
  },
};

export default updateUser;
