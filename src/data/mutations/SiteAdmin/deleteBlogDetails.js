// GrpahQL
import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import BlogDetailsType from '../../types/BlogDetailsType';

// Sequelize models
import { BlogDetails } from '../../models';

const deleteBlogDetails = {

  type: BlogDetailsType,

  args: {
    id: { type: new NonNull(IntType) },
  },

  async resolve({ request, response }, {
        id,
    }) {
    if (request.user.admin) {
      const blogDetails = await BlogDetails.findById(id);
      if (!blogDetails) {
        return {
          status: '404',
        };
      }

      const deleteBlog = await BlogDetails.destroy({
        where: {
          id,
        },
      });

      if (deleteBlog) {
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

export default deleteBlogDetails;
