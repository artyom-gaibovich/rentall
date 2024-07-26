// GrpahQL
import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import HomeBannerType from '../../types/HomeBannerType';
import { HomeBanner } from '../../../data/models';


const deleteHomeBanner = {

  type: HomeBannerType,

  args: {
    id: { type: new NonNull(IntType) },
  },

  async resolve({ request, response }, {
        id,
    }) {
    if (request.user.admin) {
      const HomeBannerDetails = await HomeBanner.findById(id);
      if (!HomeBannerDetails) {
        return {
          status: '404',
        };
      }
      const deleteHomeBannerimage = await HomeBanner.destroy({
        where: {
          id,
        },
      });
      if (deleteHomeBannerimage) {
        return {
          status: '200',
        };
      }
      return {
        status: '400',
      };
    }
    return {
      status: 'notLoggedIn',
    };
  },
};

export default deleteHomeBanner;
