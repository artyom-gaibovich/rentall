import sequelize from '../../data/sequelize';
import { Reservation, ThreadItems, SiteSettings } from '../../data/models';
import { emailBroadcast } from './completedEmail';

const CronJob = require('cron').CronJob;
const AllowedLimit = require('async-sema').RateLimit(10);

const reservationComplete = (app) => {
  new CronJob('0 55 23 * * *', async () => { // Run every day on 11.55 PM
    // console.log('/********************************************/');
    // console.log('HOLY MOLY RESERVATION COMPLETE CRON STARTED');

		// get all reservation id
    const getReservationIds = await Reservation.findAll({
      attributes: ['id', 'reservationState', 'hostId', 'checkIn', 'checkOut', 'guests', [sequelize.literal('TIMESTAMPDIFF(DAY, checkOut, NOW())'), 'day_difference']],
      having: {
        day_difference: {
          $gte: 0,
        },
        reservationState: 'approved',
      },
    });

		// Update Reservation Status to completed
    if (getReservationIds != null && getReservationIds.length > 0) {
      getReservationIds.map(async (item) => {
        await AllowedLimit();

				// Get ThreadId
        const getThreadId = await ThreadItems.findOne({
          where: {
            reservationId: item.id,
          },
        });

				// Create new ThreaItem for completion
        if (getThreadId) {
          const createThreadItem = await ThreadItems.create({
            threadId: getThreadId.threadId,
            sentBy: item.hostId,
            type: 'completed',
            startDate: item.checkIn,
            endDate: item.checkOut,
            personCapacity: item.guests,
            reservationId: item.id,
          });
        }

				// Update Reservation Status
        const updateReservation = await Reservation.update({
          reservationState: 'completed',
        }, {
          where: {
            id: item.id,
          },
        });

				// Update ThreadItems
				/* let updateThreadItems = await ThreadItems.update({
					type: 'completed'
				}, {
					where: {
						reservationId: item.id
					}
				}); */

				// await emailBroadcast(item.id);
      });
    }

    // console.log('HOLY MOLY RESERVATION COMPLETE CRON COMPLETED');
    // console.log('/********************************************/');
  }, null, true, 'America/Los_Angeles');
};

export default reservationComplete;
