import ReservationType from '../../types/ReservationType';
import { Reservation } from '../../models';

import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

const getListReservation = {

  type: ReservationType,

  args: {
    listId: { type: new NonNull(IntType) },
  },

  async resolve({ request }, { listId }) {
    if (request.user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tripFilter = {
        $gte: today,
      };
      const count = await Reservation.count({
        where: {
          listId,
          checkIn: tripFilter,
        },
      });
      return {
        status: '200',
        count,
      };
    }
    return {
      status: 'notLoggedIn',
    };
  },
};

export default getListReservation;
