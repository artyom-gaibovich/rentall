import PopularLocationType from '../../types/siteadmin/PopularLocationType';
import { PopularLocation } from '../../../data/models';
import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

const updatePopularLocation = {
  type: PopularLocationType,
  args: {
    id: { type: IntType },
    location: { type: StringType },
    locationAddress: { type: StringType },
    image: { type: StringType },
  },
  async resolve({ request }, {
        id,
        location,
        locationAddress,
        image,
    }) {
    if (request.user && request.user.admin == true) {
      const Update = await PopularLocation.update({
        location,
        locationAddress,
        image,
      }, {
        where: {
          id,
        },
      });
      return {
        status: 'success',
      };
    }
    return {
      status: 'failed',
    };
  },
};
export default updatePopularLocation;
