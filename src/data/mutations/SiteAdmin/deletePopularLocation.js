// GrpahQL
import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import PopularLocationType from '../../types/siteadmin/PopularLocationType';

// Sequelize models
import { PopularLocation } from '../../models';

const deletePopularLocation = {

  type: PopularLocationType,

  args: {
    id: { type: new NonNull(IntType) },
  },

  async resolve({ request, response }, {
        id,
    }) {
    if (request.user.admin) {
      const PopularLocationDetails = await PopularLocation.findById(id);
      if (!PopularLocationDetails) {
        return {
          status: '404',
        };
      }

      const deleteLocation = await PopularLocation.destroy({
        where: {
          id,
        },
      });

      if (deleteLocation) {
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

export default deletePopularLocation;
