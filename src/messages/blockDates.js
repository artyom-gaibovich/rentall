import { Reservation, ListBlockedDates } from '../../../../data/models';
import moment from 'moment';
import sequelize from 'sequelize';

export async function blockDates(
  reservationId,
) {
  var dates = [];
  const reservation = await Reservation.findOne({
    where: {
      id: reservationId,
    },
  });

  if (reservation) {
    var dates = [];
    let start = new Date(reservation.checkIn);
    const end = new Date(reservation.checkOut);
    const copy = new Date(start);
    const endTimevalue = end.setDate(end.getDate() - 1);
    const endTime = new Date(endTimevalue);
    dates.push(copy);
    while (start < endTime) {
      dates.push(start);
      const newDate = start.setDate(start.getDate() + 1);
      start = new Date(newDate);
    }

    let day;
    let listBlockedDates;
    dates.map(async (blockedDates) => {
      day = moment(blockedDates).format('YYYY-MM-DD');
      const dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);

      const blockedDatesFind = await ListBlockedDates.findAll({
        where: {
          blockedDates: dayList,
          listId: reservation.listId,
          calendarStatus: 'available',
        },
      });

      let blockfindDates,
        createdDates,
        updateDates;
      const chooseDates = moment(moment(blockedDates)).format('YYYY-MM-DD');

      blockedDatesFind.map(async (value, keys) => {
        blockfindDates = moment(value.blockedDates).format('YYYY-MM-DD');
        if (chooseDates == blockfindDates) {
          updateDates = await ListBlockedDates.update({
            listId: reservation.listId,
            blockedDates,
            calendarStatus: 'blocked',
            reservationId,
          },
            {
              where: {
                listId: reservation.listId,
                blockedDates: dayList,
              },
            });
        } else {
          createdDates = await ListBlockedDates.create({
            listId: reservation.listId,
            blockedDates,
            calendarStatus: 'blocked',
            reservationId,
          });
        }
      });

      if (blockedDatesFind.length == 0) {
        createdDates = await ListBlockedDates.create({
          listId: reservation.listId,
          blockedDates,
          calendarStatus: 'blocked',
          reservationId,
        });
      }
    });

    // dates.map(async (blockedDates) => {
    //   await ListBlockedDates.findOrCreate({
    //     where: {
    //       listId: reservation.listId,
    //       reservationId,
    //       blockedDates
    //     },
    //     defaults: {
    //       //properties you want on create
    //       listId: reservation.listId,
    //       reservationId,
    //       blockedDates
    //     }
    //   });
    // });
  }
}
