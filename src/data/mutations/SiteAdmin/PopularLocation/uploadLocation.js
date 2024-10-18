import PoularLocationType from '../../../types/siteadmin/PopularLocationType';
import { PopularLocation } from '../../../models';

import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';

const uploadLocation = {

  type: PoularLocationType,

  args: {
    image: { type: StringType },
    id: { type: IntType },
  },

  async resolve({ request }, { image, id }) {
    if (request.user && request.user.admin == true) {
      const updateLocation = await PopularLocation.update({
        image,
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

export default uploadLocation;
