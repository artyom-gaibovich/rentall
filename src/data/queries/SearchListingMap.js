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

  },

  async resolve({ request }, {

  }) {
    try {
      let limit = 999999999999999999,
        offset = 0;


      // SQL query for results
      const results = await Listing.findAll({
        attributes: ['id', 'title', 'personCapacity', 'lat', 'city', 'street', 'state', 'lng', 'beds', 'coverPhoto', 'bookingType', 'userId', 'reviewsCount'],
        where: {isPublished: true},
        order: [['id', 'DESC'],['reviewsCount', 'DESC']],
      });

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
