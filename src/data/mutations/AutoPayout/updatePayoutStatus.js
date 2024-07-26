import {
    GraphQLBoolean as BooleanType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';

import ReservationType from '../../types/ReservationType';
import { Reservation } from '../../models';

const updatePayoutStatus = {
  type: ReservationType,

  args: {
    id: { type: new NonNull(IntType) },
    isHold: { type: new NonNull(BooleanType) },
  },

  async resolve({ request }, { id, isHold }) {
    let isUpdated = false;
    if (request.user && request.user.admin) {
      // console.log(isHold);
      const updateStatus = await Reservation.update({
        isHold,
      }, {
        where: {
          id,
        },
      }).then((instance) => {
        if (instance > 0) {
          isUpdated = true;
        }
      });

      if (isUpdated) {
        return {
          status: '200',
        };
      }
      return {
        status: '400',
        errorMessage: 'Not Updated',
      };
    }
    return {
      status: '500',
      errorMessage: 'Not Logged In',
    };
  },
};

export default updatePayoutStatus;
