import UserAccountType from '../../types/userAccountType';
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
  } from 'graphql';
import { User } from '../../../data/models';

const YookassaRemoveConnection = {
  type: UserAccountType,
  args: {
    userId: { type: new NonNull(StringType) },
  },
  async resolve({ request }) {
    // console.log(request);
    if (request.user && request.user.admin != true) {
        // console.log('start user update')
        const data = await User.update(
            {
                yookassaToken: null,
                expiresYookassaToken: null,
            },
            {
                where: {
                id: request.user.id,
                },
            },
        )
        // console.log({removeYookassa: data})
      
    } else {
      return {
        status: 'notLoggedIn',
      };
    }
  },
};
export default YookassaRemoveConnection;