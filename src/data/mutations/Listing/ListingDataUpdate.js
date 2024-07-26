// GrpahQL
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
} from 'graphql';

// GraphQL Type
import EditListingType from '../../types/EditListingType';

// Sequelize models
import {
    Listing,
    UserHouseRules,
    UserFish,
    ListingData,
} from '../../../data/models';

const ListingDataUpdate = {

  type: EditListingType,

  args: {
    id: { type: IntType },
    houseRules: { type: new List(IntType) },
    fish: { type: new List(IntType) },
    checkInStart: { type: StringType },
    checkInEnd: { type: StringType },
    minNight: { type: IntType },
    maxNight: { type: IntType },
    cancellationPolicy: { type: IntType },
    maxDaysNotice: { type: StringType },
    bookingNoticeTime: { type: StringType },
    basePrice: { type: FloatType },
    cleaningPrice: { type: FloatType },
    currency: { type: StringType },
  },

  async resolve({ request, response }, {
        id,
        houseRules,
        fish,
        checkInStart,
        checkInEnd,
        minNight,
        maxNight,
        cancellationPolicy,
        maxDaysNotice,
        bookingNoticeTime,
        basePrice,
        cleaningPrice,
        currency,
    }) {
    let isListUpdated = false;

        // Check whether user is logged in
    if (request.user || request.user.admin) {
      let where = { id };
      if (!request.user.admin) {
        where = {
          id,
          userId: request.user.id,
        };
      }

            // Confirm whether the Listing Id is available
      const isListingAvailable = await Listing.findById(id);

      if (isListingAvailable != null) {
        if (houseRules) {
          const removeHouseRules = await UserHouseRules.destroy({
            where: {
              listId: id,
            },
          });
          if (houseRules.length > 0) {
            houseRules.map(async (item, key) => {
              const updateHouseRules = await UserHouseRules.create({
                    listId: id,
                    houseRulesId: item,
                  });
            });
          }
        }

        if (fish) {
          const removeFish = await UserFish.destroy({
            where: {
              listId: id,
            },
          });
          if (fish.length > 0) {
            fish.map(async (item, key) => {
              const updateFish = await UserFish.create({
                    listId: id,
                    fishId: item,
                  });
            });
          }
        }

        const maxDaysNoticeValue = 'available';
                // Check if record already available for this listing
        const isListingIdAvailable = await ListingData.findOne({ where: { listId: id } });
        if (isListingIdAvailable != null) {
                    // Update Record
          const updateData = ListingData.update({
            checkInStart,
            checkInEnd,
            minNight,
            maxNight,
            cancellationPolicy,
            maxDaysNotice,
            bookingNoticeTime,
            basePrice,
            cleaningPrice,
            currency,
          },
            {
              where: {
                listId: id,
              },
            });
          isListUpdated = true;
        } else {
                    // Create New Record
          const createData = ListingData.create({
            listId: id,
            checkInStart,
            checkInEnd,
            minNight,
            maxNight,
            cancellationPolicy,
            maxDaysNotice,
            bookingNoticeTime,
            basePrice,
            cleaningPrice,
            currency,
          });

          if (createData) {
            isListUpdated = true;
          }
        }


        if (isListUpdated) {
          return {
            status: 'success',
          };
        }
        return {
          status: 'failed',
        };
      }
      return {
        status: 'notAvailable',
      };
    }
    return {
      status: 'notLoggedIn',
    };
  },
};

export default ListingDataUpdate;
