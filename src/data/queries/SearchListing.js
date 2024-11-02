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
import moment, {unix} from 'moment';

import {Search} from "../../routes/search/Search.js"

// import Search from '../../routes/search/Search';

import fetch from 'node-fetch';

const SearchListing = {

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
        sw_lat: {type: FloatType},
        sw_lng: {type: FloatType},
        ne_lat: {type: FloatType},
        ne_lng: {type: FloatType},
        location: {type: StringType},
        zoomLevel: {type: IntType},
    },

    async resolve({request}, {
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
        sw_lat,
        sw_lng,
        ne_lat,
        ne_lng,
    }) {
        try {
            let limit = 12000,
                offset = 0;
            const publishedFilter = {isPublished: true};
            const unAvailableFilter = {
                id: {
                    $notIn: [
                        sequelize.literal('SELECT listId FROM ListingData WHERE maxDaysNotice=\'unavailable\''),
                    ],
                },
            };
            let mapBoundsFilter,
                geographyFilter,
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

            if (currentPage) offset = (currentPage - 1) * limit;

            console.log({
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
                sw_lat,
                sw_lng,
                ne_lat,
                ne_lng,
                limit,
                offset
            })

            // Booking Type Filter
            if (bookingType && bookingType === 'instant') bookingTypeFilter = {bookingType};

            if (sw_lat && ne_lat && sw_lng && ne_lng) { // Maps NorthWest & SouthEast view ports
                mapBoundsFilter = {
                    id: {
                        $in: [
                            sequelize.literal(`
                                SELECT id
                                FROM Listing
                                WHERE (lat BETWEEN ${sw_lat} AND ${ne_lat})
                                  AND (lng BETWEEN ${sw_lng} AND ${ne_lng})`,
                            ),
                        ],
                    },
                };
            }

            // Geography Type Filter
            if (geoType && !searchByMap) {
                const geographyConverted = await JSON.parse(geography);
                if (geoType === 'street') {
                    geographyFilter = {
                        $or: [
                            {
                                street: {
                                    $like: `%${geographyConverted.route}%`,
                                },
                                state: geographyConverted.province,
                                country: geographyConverted.country,
                            },
                            {
                                street: {
                                    $like: `%${geographyConverted.route}%`,
                                },
                                state: {
                                    $like: `${geographyConverted.province}%`,
                                },
                                country: geographyConverted.country,
                            },
                        ],
                    };
                } else if (geoType === 'province') {
                    geographyFilter = {
                        $or: [
                            {
                                state: geographyConverted.province,
                                country: geographyConverted.country,
                            },
                            {
                                state: {
                                    $like: `${geographyConverted.province}%`,
                                },
                                country: geographyConverted.country,
                            },
                        ],
                    };
                } else if (geoType === 'country') {
                    geographyFilter = {country: geographyConverted.country};
                }
            } else if (lat && lng && !searchByMap) {
                geographyFilter = {
                    id: {
                        $in: [
                            sequelize.literal(`
                                SELECT id
                                FROM Listing
                                WHERE (
                                          6371 *
                                          acos(
                                                  cos(radians(${lat})) *
                                                  cos(radians(lat)) *
                                                  cos(
                                                          radians(lng) - radians(${lng})
                                                  ) +
                                                  sin(radians(${lat})) *
                                                  sin(radians(lat))
                                          )
                                          ) < ${distance}
                            `),
                        ],
                    },
                };
            }

            // Price Range Filter
            if (priceRange && priceRange.length > 0) {
                priceRangeFilter = {
                    id: {
                        $in: [
                            sequelize.literal(`SELECT listId
                                               FROM ListingData
                                               WHERE (basePrice /
                                                      (SELECT rate FROM CurrencyRates WHERE currencyCode = currency limit 1)) BETWEEN ${priceRange[0]}
                                                 AND ${priceRange[1]}`),
                        ],
                    },
                };
            }

            // Number of Bed Rooms Filter
            if (bedrooms) bedRoomCountFilter = {bedrooms: {$gte: bedrooms}};

            // Number of  Bathrooms Filter
            if (bathrooms) bathRoomCountFilter = {bathrooms: {$gte: bathrooms}};

            // Number of Beds Filter
            if (beds) bedCountFilter = {beds: {$gte: beds}};

            // Person Capacity Filter
            if (personCapacity) personCapacityFilter = {personCapacity: {$gte: personCapacity}};

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
            }

            // Fish Filter
            if (fish && fish.length > 0) {
                fishFilter = {
                    id: {
                        $in: [
                            sequelize.literal(`SELECT listId
                                               FROM UserFish
                                               WHERE fishId in (${fish.toString()})
                                               GROUP BY listId
                                               HAVING COUNT(listId) >= ${fish.length}`),
                        ],
                    },
                };
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
            }

            let where,
                whereNot,
                filters = [
                    bookingTypeFilter,
                    bedRoomCountFilter,
                    priceRangeFilter,
                    bathRoomCountFilter,
                    bedCountFilter,
                    personCapacityFilter,
                    roomTypeFilter,
                    amenitiesFilter,
                    safetyAmenitiesFilter,
                    spacesFilter,
                    houseRulesFilter,
                    fishFilter,
                    dateRangeFilter,
                    minNightsFilter,
                    maxNightsFilter,
                    maximumNoticeFilter,
                    publishedFilter,
                    unAvailableFilter,
                ];

            if (mapBoundsFilter || geographyFilter) {
                where = {
                    $or: [
                        mapBoundsFilter || {},
                        geographyFilter || {},
                    ],
                    $and: filters,
                };
                whereNot = {
                    $or: [
                        {},
                        {},
                    ],
                    $and: filters,
                };
            } else {
                where = {$and: filters};
                whereNot = {$and: filters};
            }

            console.log(whereNot)


            // SQL query for count
            const count = await Listing.count({where});

            // SQL query for results
            const results = await Listing.findAll({
                attributes: ['id', 'title', 'personCapacity', 'lat', 'lng', 'beds', 'coverPhoto', 'bookingType', 'userId', 'reviewsCount'],
                where,
                limit,
                offset,
                order: [['id', 'DESC'], ['reviewsCount', 'DESC']],
            });

            const resultsSearch = await Listing.findAll({
                attributes: ['id', 'title', 'personCapacity', 'lat', 'lng', 'beds', 'coverPhoto', 'bookingType', 'userId', 'reviewsCount'],
                where: whereNot,
                limit,
                offset,
                order: [['id', 'DESC'], ['reviewsCount', 'DESC']],
            });

            const allFound = await Listing.findAll({
                attributes: ['id', 'title', 'personCapacity', 'lat', 'lng', 'beds', 'coverPhoto', 'bookingType', 'userId', 'reviewsCount'],
                where,
                limit: 1000,
                offset,
                order: [['id', 'DESC'], ['reviewsCount', 'DESC']],
            });
            console.log({
                count,
                results,
                allFound
            });
            return {
                count,
                results,
                allFound,
                resultsSearch
            };
        } catch (e) {
            console.error(e);
            return {
                count: 0,
                results: [],
                allFound: [],
                resultsSearch: []
            };
        }
    },
};

export default SearchListing;
