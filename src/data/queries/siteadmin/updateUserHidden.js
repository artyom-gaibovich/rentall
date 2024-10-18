import UpdateUserTypeHidden from '../../types/siteadmin/UpdateUserTypeHidden';
import { UserProfile, User } from '../../../data/models';

import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const updateUserHidden = {

  type: UpdateUserTypeHidden,

  args: {
    profileId: { type: new NonNull(IntType) },
    phoneNumber: { type: StringType },
    userId: { type: StringType },
    email: { type: StringType },
    firstName: { type: StringType },
    lastName: { type: StringType },
  },

  async resolve({ request }, {
    profileId,
    phoneNumber,
    firstName,
    lastName,
    userId,
    email,
  },
  ) {
    // if (request.user && request.user.admin == true) {
    let isUserUpdated = false;

      // Get All User Profile Data
      // console.log('updating', phoneNumber, email, userId)
    if (email) {
      const updateEmail = User.update(
        {
          email,
        },
        {
          where: {
            id: userId,
          },
        },
        );
    }
    if (firstName && lastName) {
      const updateData = await UserProfile.update(
        {
          phoneNumber,
          email,
          firstName,
          lastName,
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
    }

    if (phoneNumber) {
      const updateData = await UserProfile.update(
        {
          phoneNumber,
          email,
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
    }


      // if (isUserUpdated) {
    return {
      status: 'success',
    };
      // }
      // return {
      //   status: 'failed',
      // };
    // }
    return {
      status: 'failed',
    };
  },
};

export default updateUserHidden;
