import StaticBlockType from '../../types/siteadmin/StaticBlockType';
import { StaticInfoBlock } from '../../../data/models';

import {
    GraphQLString as StringType,
} from 'graphql';

const removeStaticImages = {

  type: StaticBlockType,

  args: {
    name: { type: StringType },
  },

  async resolve({ request }, { name }) {
    if (request.user && request.user.admin == true) {
      const removeStaticImages = await StaticInfoBlock.update({
        image: null,
      },
        {
          where: { name },
        });

      if (removeStaticImages) {
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

export default removeStaticImages;
