import sequelize from '../../data/sequelize';
import { Reservation, ThreadItems, SiteSettings } from '../../data/models';
import { emailBroadcast } from './completedEmail';

const CronJob = require('cron').CronJob;
const AllowedLimit = require('async-sema').RateLimit(10);

const reservationReview = (app) => {
  new CronJob('0 55 23 * * *', async () => { // Run every day on 11.55 PM
    // console.log('/********************************************/');
    // console.log('HOLY MOLY RESERVATION REVIEW CRON STARTED');

    let emailLogo;
    const getEmailLogo = await SiteSettings.findOne({
      where: {
        title: 'Email Logo',
      },
      raw: true,
    });

    emailLogo = getEmailLogo && getEmailLogo.value;

		// get all reservation id
    const getReservationIds = await Reservation.findAll({
      attributes: ['id', 'reservationState', 'hostId', 'checkIn', 'checkOut', [sequelize.literal('TIMESTAMPDIFF(DAY, checkOut, NOW())'), 'day_difference']],
      having: {
        day_difference: {
          $eq: 1,
        },
        reservationState: 'completed',
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

        await emailBroadcast(item.id, emailLogo);
      });
    }

    // console.log('HOLY MOLY RESERVATION REVIEW CRON COMPLETED');
    // console.log('/********************************************/');
  }, null, true, 'America/Los_Angeles');
};

export default reservationReview;
