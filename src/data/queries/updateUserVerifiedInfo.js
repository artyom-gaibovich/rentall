import UserVerifiedInfoType from '../types/UserVerifiedInfoType';
import { UserVerifiedInfo } from '../../data/models';

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

const updateUserVerifiedInfo = {

  type: UserVerifiedInfoType,

  args: {
    item: { type: new NonNull(StringType) },
  },

  async resolve({ request }, { item }) {
    if (request.user && request.user.admin != true) {
      if (item === 'email') {
        await UserVerifiedInfo.update({
          isEmailConfirmed: true,
        },
          {
            where: {
              userId: request.user.id,
            },
          });

        return {
          status: 'success',
        };
      }

      if (item === 'facebook') {
        await UserVerifiedInfo.update({
          isFacebookConnected: false,
        },
          {
            where: {
              userId: request.user.id,
            },
          });

        return {
          status: 'success',
        };
      }

      if (item === 'odnoklassnimki') {
        await UserVerifiedInfo.update({
          isOdnoklassnikiConnected: false,
        },
          {
            where: {
              userId: request.user.id,
            },
          });

        return {
          status: 'success',
        };
      }

      if (item === 'vk') {
        await UserVerifiedInfo.update({
          isVkConnected: false,
        },
          {
            where: {
              userId: request.user.id,
            },
          });

        return {
          status: 'success',
        };
      }

      if (item === 'yandex') {
        await UserVerifiedInfo.update({
          isYandexConnected: false,
        },
          {
            where: {
              userId: request.user.id,
            },
          });
      }

      if (item === 'google') {
        await UserVerifiedInfo.update({
          isGoogleConnected: false,
        },
          {
            where: {
              userId: request.user.id,
            },
          });

        return {
          status: 'success',
        };
      }
    } else {
      return { status: 'notLoggedIn' };
    }
  },
};

export default updateUserVerifiedInfo;
