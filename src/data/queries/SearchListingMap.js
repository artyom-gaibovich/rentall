import searchListingType from '../types/searchListingType';
import {
  Listing,
} from '../../data/models';
import sequelize from '../sequelize';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BoolType,
} from 'graphql';
import moment, { unix } from 'moment';

import fetch from 'node-fetch';

const SearchListingMap = {

  type: searchListingType,

  args: {
    personCapacity: {type: IntType},
    dates: {type: StringType},
    currentPage: {type: IntType},
    lat: {type: FloatType},
    lng: {type: FloatType},
    distance: {type: IntType},
    roomType: {type: new List(IntType)},
    bedrooms: {type: IntType},
    bathrooms: {type: IntType},
    beds: {type: IntType},
    amenities: {type: new List(IntType)},
    safetyAmenities: {type: new List(IntType)},
    spaces: {type: new List(IntType)},
    houseRules: {type: new List(IntType)},
    fish: {type: new List(IntType)},
    priceRange: {type: new List(IntType)},
    geography: {type: StringType},
    bookingType: {type: StringType},
    geoType: {type: StringType},
    searchByMap: {type: BoolType},
    location: {type: StringType},
    zoomLevel: {type: IntType},
    facilities: {type: new List(IntType)},
    eat: {type: new List(IntType)},
    rent: {type: new List(IntType)},
    help: {type: new List(IntType)},
  },

  async resolve({ request }, {
    personCapacity,
        dates,
        currentPage,
        lat,
        lng,
        distance,
        roomType,
        bedrooms,
        bathrooms,
        beds,
        amenities,
        safetyAmenities,
        spaces,
        houseRules,
        fish,
        priceRange,
        geography,
        bookingType,
        geoType,
        searchByMap,
        facilities,
        eat,
        rent,
        help
  }) {
    try {
      let limit = 999999999999999999,
        offset = 0;

        const publishedFilter = {isPublished: true};
        const unAvailableFilter = {
            id: {
                $notIn: [
                    sequelize.literal('SELECT listId FROM ListingData WHERE maxDaysNotice=\'unavailable\''),
                ],
            },
        };
        let filters = [
            publishedFilter,
            unAvailableFilter,
          ];
        let mapBoundsFilter,
            bookingTypeFilter = {};
        let bedRoomCountFilter = {},
            priceRangeFilter = {},
            bathRoomCountFilter = {},
            bedCountFilter = {};
        let personCapacityFilter = {},
            roomTypeFilter = {},
            amenitiesFilter = {},
            safetyAmenitiesFilter = {},
            spacesFilter = {},
            houseRulesFilter = {},
            fishFilter = {};
        let dateRangeFilter = {},
            minNightsFilter = {},
            maxNightsFilter = {},
            maximumNoticeFilter = {};
        let facilitiesFilter = {},
            eatFilter = {},
            rentFilter = {},
            helpFilter = {};


            console.log('BXHW',{
              personCapacity,
              dates,
              currentPage,
              lat,
              lng,
              distance,
              roomType,
              bedrooms,
              bathrooms,
              beds,
              amenities,
              safetyAmenities,
              spaces,
              houseRules,
              fish,
              priceRange,
              geography,
              bookingType,
              geoType,
              searchByMap,
              limit,
              offset,
              facilities,
              eat,
              rent,
              help
          })

          if (bookingType && bookingType === 'instant') {
            bookingTypeFilter = {bookingType};
            filters.push(bookingTypeFilter);
          }

          // Price Range Filter
          if (priceRange && priceRange.length > 0) {
            let priceRanges = []
            if (priceRange.includes(2913)) {
                priceRanges.push([0, 5000])
            }
            if (priceRange.includes(2914)) {
                priceRanges.push([5000, 10000])
            }
            if (priceRange.includes(2915)) {
                priceRanges.push([10000, 20000])
            }
            if (priceRange.includes(2916)) {
                priceRanges.push([20000, 100000])
            }

            if (priceRanges.length == 1) {
                priceRangeFilter = {
                    id: {
                        $in: [
                            sequelize.literal(`SELECT listId
                                            FROM ListingData
                                            WHERE (basePrice /
                                                    (SELECT rate FROM CurrencyRates WHERE currencyCode = currency limit 1)) BETWEEN ${priceRanges[0][0]}
                                                AND ${priceRanges[0][1]}`),
                        ],
                    },
                };
            }
            if (priceRanges.length == 2) {
                priceRangeFilter = {
                    id: {
                        $in: [
                            sequelize.literal(`
                                SELECT listId
                                FROM ListingData
                                WHERE 
                                (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[0][0]} AND ${priceRanges[0][1]}
                                ) OR (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[1][0]} AND ${priceRanges[1][1]}
                                )
                            `),
                        ],
                    },
                };
            }
            if (priceRanges.length == 3) {
                priceRangeFilter = {
                    id: {
                        $in: [
                            sequelize.literal(`
                                SELECT listId
                                FROM ListingData
                                WHERE 
                                (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[0][0]} AND ${priceRanges[0][1]}
                                ) OR (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[1][0]} AND ${priceRanges[1][1]}
                                ) OR (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[2][0]} AND ${priceRanges[2][1]}
                                )
                            `),
                        ],
                    },
                };
            }
            if (priceRanges.length == 4) {
                priceRangeFilter = {
                    id: {
                        $in: [
                            sequelize.literal(`
                                SELECT listId
                                FROM ListingData
                                WHERE 
                                (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[0][0]} AND ${priceRanges[0][1]}
                                ) OR (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[1][0]} AND ${priceRanges[1][1]}
                                ) OR (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[2][0]} AND ${priceRanges[2][1]}
                                ) OR (
                                    (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode = currency LIMIT 1)) BETWEEN ${priceRanges[3][0]} AND ${priceRanges[3][1]}
                                )
                            `),
                        ],
                    },
                };
            }
            filters.push(priceRangeFilter);
        }

          // Number of Bed Rooms Filter
          if (bedrooms) {
            bedRoomCountFilter = {bedrooms: {$gte: bedrooms}} 
            filters.push(bedRoomCountFilter)
          };

          // Number of  Bathrooms Filter
          if (bathrooms) {
            bathRoomCountFilter = {bathrooms: {$gte: bathrooms}}
            filters.push(bathRoomCountFilter)
          };

          // Number of Beds Filter
          if (beds) {
            bedCountFilter = {beds: {$gte: beds}}
            filters.push(bedCountFilter)
          };

          // Person Capacity Filter
          if (personCapacity) {
            personCapacityFilter = {personCapacity: {$gte: personCapacity}}
            filters.push(personCapacity)
          };

          if (help && help.length > 0) {
              let helpData = []
              if (help.includes(225)) {
                  helpData.push(166, 225, 251)
              }
              if (help.includes(173)) {
                  helpData.push(173)
              }
              if (help.includes(230)) {
                  helpData.push(31, 171, 217, 230, 231, 241)
              }
              helpFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM UserSafetyAmenities
                                             WHERE safetyAmenitiesId in (${helpData.toString()})`),
                      ],
                  },
              };
              filters.push(helpFilter)
          }

          if (rent && rent.length > 0) {
              let rentData = []
              if (rent.includes(29)) {
                  rentData.push(29, 169, 227, 252)
              }
              if (rent.includes(50)) {
                  rentData.push(167, 174, 254)
              }
              if (rent.includes(202)) {
                  rentData.push(202)
              }
              rentFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM UserSafetyAmenities
                                             WHERE safetyAmenitiesId in (${rentData.toString()})`),
                      ],
                  },
              };
              filters.push(rentFilter)
          }

          if (facilities && facilities.length > 0 && facilities.length == 1) {
              let facilitiesData = [27, 28, 151, 152, 210 ] 

              if (facilities[0] == 3) { 
                  facilitiesFilter = {
                      id: {
                          $in: [
                              sequelize.literal(`SELECT listId
                                                 FROM UserAmenities
                                                 WHERE amenitiesId in (${facilitiesData.toString()})
                                                 GROUP BY listId
                                                 HAVING COUNT(listId) >= ${facilitiesData.length}`),
                          ],
                      },
                  };
              } else {
                  facilitiesFilter = {
                      id: {
                          $in: [
                              sequelize.literal(`SELECT listId
                                                 FROM UserAmenities
                                                 WHERE amenitiesId in (${facilitiesData.toString()})
                                                 GROUP BY listId
                                                 HAVING COUNT(listId) < ${facilitiesData.length}`),
                          ],
                      },
                  };
              }

              filters.push(facilitiesFilter)

          }
          

          if (eat && eat.length > 0 && eat.length == 1) {
              let eatData = []
              if (eat[0] == 0) { 
                  eatData = [ 26, 146, 147, 207 ] 
                  eatFilter = {
                      id: {
                          $in: [
                              sequelize.literal(`SELECT listId
                                                 FROM UserAmenities
                                                 WHERE amenitiesId in (${eatData.toString()})`),
                          ],
                      },
                  };
              } else {
                  eatData = [ 33, 154, 172 ] 
                  eatFilter = {
                      id: {
                          $in: [
                              sequelize.literal(`SELECT listId
                                                 FROM UserSafetyAmenities
                                                 WHERE safetyAmenitiesId in (${eatData.toString()})`),
                          ],
                      },
                  };
              }
              filters.push(eatFilter)
          }

          // Room type Filter
          if (roomType && roomType.length > 0) {
              roomTypeFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM UserListingData
                                             WHERE settingsId in (${roomType.toString()})`),
                      ],
                  },
              };
              filters.push(roomTypeFilter)
          }

          // Amenities Filter
          if (amenities && amenities.length > 0) {
              amenitiesFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM UserAmenities
                                             WHERE amenitiesId in (${amenities.toString()})
                                             GROUP BY listId
                                             HAVING COUNT(listId) >= ${amenities.length}`),
                      ],
                  },
              };
              filters.push(amenitiesFilter)
          }

          // Safety Amenities Filter
          if (safetyAmenities && safetyAmenities.length > 0) {
              safetyAmenitiesFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM UserSafetyAmenities
                                             WHERE safetyAmenitiesId in (${safetyAmenities.toString()})
                                             GROUP BY listId
                                             HAVING COUNT(listId) >= ${safetyAmenities.length}`),
                      ],
                  },
              };
              filters.push(safetyAmenitiesFilter)
          }

          // Spaces Filter
          if (spaces && spaces.length > 0) {
              spacesFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM UserSpaces
                                             WHERE spacesId in (${spaces.toString()})
                                             GROUP BY listId
                                             HAVING COUNT(listId) >= ${spaces.length}`),
                      ],
                  },
              };
              filters.push(spacesFilter)
          }

          // House Rules Filter
          if (houseRules && houseRules.length > 0) {
              houseRulesFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM UserHouseRules
                                             WHERE houseRulesId in (${houseRules.toString()})
                                             GROUP BY listId
                                             HAVING COUNT(listId) >= ${houseRules.length}`),
                      ],
                  },
              };
              filters.push(houseRulesFilter)
          }

          // Fish Filter
          if (fish && fish.length > 0) {
              fishFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`
                              SELECT listId
                              FROM UserFish
                              WHERE fishId in (${fish.toString()})
                              GROUP BY listId
                              HAVING COUNT(listId) >= ${fish.length}
                          `),
                      ],
                  },
              };
              filters.push(fishFilter)
          }

          if (dates && dates.toString().trim() !== '') {
              let checkIn = moment(dates.toString().split('AND')[0]),
                  checkOut = moment(dates.toString().split('AND')[1]);
              const noticeFilter = [];
              [3, 6, 9, 12].map((value) => {
                  const date = moment().add(value, 'months').format('YYYY-MM-DD');
                  if (checkOut.isBetween(checkIn, date)) noticeFilter.push(`'${value}months'`);
              });

              // Maximum Notice Filter
              maximumNoticeFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM ListingData
                                             WHERE maxDaysNotice in ('available', ${noticeFilter.toString()})`),
                      ],
                  },
              };

              // Date Range Filter
              dateRangeFilter = {
                  id: {
                      $notIn: [
                          sequelize.literal(`SELECT listId
                                             FROM ListBlockedDates
                                             WHERE blockedDates BETWEEN${dates}and calendarStatus != 'available'`),
                      ],
                  },
              };

              // Min Night Filter
              minNightsFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM ListingData
                                             WHERE minNight = 0
                                                OR minNight <= ${checkOut.diff(checkIn, 'days')}`),
                      ],
                  },
              };

              // Max Night Filter
              maxNightsFilter = {
                  id: {
                      $in: [
                          sequelize.literal(`SELECT listId
                                             FROM ListingData
                                             WHERE maxNight = 0
                                                OR maxNight >= ${checkOut.diff(checkIn, 'days')}`),
                      ],
                  },
              };

              filters.push(maximumNoticeFilter, dateRangeFilter, minNightsFilter, maxNightsFilter)
          }


          let where = {$and: filters}
          
      // SQL query for results
    //   const results = await Listing.findAll({
    //     attributes: ['id', 'title', 'personCapacity', 'lat', 'city', 'street', 'state', 'lng', 'beds', 'coverPhoto', 'bookingType', 'userId', 'reviewsCount'],
    //     where,
    //     order: [['id', 'DESC'],['reviewsCount', 'DESC']],
    //   });

      let batchSize = 50;
      let results = [];
            for (let i = 0; i < 1500; i += batchSize) {
                const batch = await Listing.findAll({
                    attributes: ['id', 'title', 'lat', 'lng', 'beds', 'coverPhoto', 'bookingType', 'userId'],
                    where,
                    limit: batchSize,
                    offset: i,
                    order: [['id', 'DESC'], ['reviewsCount', 'DESC']],
                });
                results = [...results, ...batch];
            }

      return {
        count: 0,
        results,
      };
    } catch (e) {
      console.error(e);
      return {
        count: 0,
        results: [],
      };
    }
  },
};

export default SearchListingMap;
