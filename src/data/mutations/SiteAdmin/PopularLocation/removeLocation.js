import PopularLocationType from '../../../types/siteadmin/PopularLocationType';
import { PopularLocation } from '../../../models';

import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';

const removeLocation = {

  type: PopularLocationType,

  args: {
    id: { type: IntType },
    image: { type: StringType },
  },

  async resolve({ request }, { id, image }) {
    if (request.user && request.user.admin == true) {
      const updateLocation = await PopularLocation.update({
        image: null,
      }, {
        where: {
          id,
        },
      });

      if (updateLocation) {
        return {
          status: 'success',
        };
      }
      return {
        status: 'failed',
      };
    }
    return {
      status: 'not logged in',
    };
  },
};

export default removeLocation;
