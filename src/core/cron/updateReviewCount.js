import sequelize from '../../data/sequelize';
import { Reviews, Listing } from '../../data/models';

const CronJob = require('cron').CronJob;
const AllowedLimit = require('async-sema').RateLimit(25);

const updateReviewCount = (app) => {
  new CronJob('0 0 1-23 * * *', async () => { // Run every day on 1.00 AM, 11.00 PM and every one hour between 1.00 AM and 11.00 PM
    // console.log('/********************************************/');
    // console.log('HOLY MOLY UPDATE REVIEW COUNT CRON STARTED');

    // get all reservation id
    const getListIds = await Listing.findAll({
      attributes: ['id', 'userId'],
    });

    // Update Reservation Status to completed
    if (getListIds != null && getListIds.length > 0) {
      await Promise.all(getListIds.map(async (item) => {
        await AllowedLimit();
        // Get reviews count
        const reviewsCountArray = [];
        const reviewsCount = await Reviews.count({
          where: {
            listId: item.id,
            userId: item.userId,
            isAdminEnable: true,
          },
        });

        const reviewsStarRating = await Reviews.sum('rating', {
          where: {
            listId: item.id,
            userId: item.userId,
            isAdminEnable: true,
          },
        });

        if (reviewsStarRating > 0 && reviewsCount > 0) {
          reviewsCountArray.push({
            listId: item.id,
            reviewsCount: Math.round(reviewsStarRating / reviewsCount),
          });
        } else {
          reviewsCountArray.push({
            listId: item.id,
            reviewsCount: 0,
          });
        }

        reviewsCountArray && reviewsCountArray.map((item, key) => {
          const updateReservation = Listing.update({
            reviewsCount: item.reviewsCount,
          }, {
            where: {
              id: item.listId,
            },
          });
        });
      }));
    }

    // console.log('HOLY MOLY UPDATE REVIEW COUNT CRON COMPLETED');
    // console.log('/********************************************/');
  }, null, true, 'America/Los_Angeles');
};

export default updateReviewCount;
