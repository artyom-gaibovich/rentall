import sequelize from '../../data/sequelize';
import { Reservation, ListBlockedDates, ThreadItems, SiteSettings } from '../../data/models';
import fetch from '../fetch';
import { emailBroadcast } from './expiredEmail';

const CronJob = require('cron').CronJob;
const AllowedLimit = require('async-sema').RateLimit(10);

const reservationExpire = (app) => {
  new CronJob('0 55 23 * * *', async () => { // Run every day on 11.55 PM
    // console.log('/********************************************/');
    // console.log('HOLY MOLY RESERVATION EXPIRE CRON STARTED');

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
      attributes: ['id', 'reservationState', [sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, NOW())'), 'hours_difference']],
      having: {
        hours_difference: {
          $gt: 24,
        },
        reservationState: 'pending',
      },
    });

		// Store them in an array
    if (getReservationIds != null && getReservationIds.length > 0) {
      getReservationIds.map(async (item) => {
        await AllowedLimit();

				// Update Reservation Status
        const updateReservation = await Reservation.update({
          reservationState: 'expired',
        }, {
          where: {
            id: item.id,
          },
        });

				// Update ThreadItems
        const updateThreadItems = await ThreadItems.update({
          type: 'expired',
        }, {
          where: {
            reservationId: item.id,
          },
        });

				// Unblock blocked dates
        const unblockDates = await ListBlockedDates.destroy({
          where: {
            reservationId: item.id,
          },
        });

        await emailBroadcast(item.id, emailLogo);
      });
    }

    // console.log('HOLY MOLY RESERVATION EXPIRE CRON COMPLETED');
    // console.log('/********************************************/');
  }, null, true, 'America/Los_Angeles');
};

export default reservationExpire;
