import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLList as List,
  GraphQLSchema,
  GraphQLNonNull,
} from 'graphql';

import ShowListingType from './ShowListingType';
import Listing from '../models/Listing';

const searchListingType = new ObjectType({
  name: 'SearchListing',
  fields: {
    count: { type: StringType },
    results: {
      /* resolve: async (root, { minLat, maxLat, minLng, maxLng }) => {
        const listing = await Listing.findAll({
          where: {
            lat: { $between: [minLat, maxLat] },
            lng: { $between: [minLng, maxLng] },
          },
        });
        console.log(listing.length)
        return listing;
      }, */
      type: new List(ShowListingType),
      /* args : {
        minLat: { type: new GraphQLNonNull(FloatType) },
        maxLat: { type: new GraphQLNonNull(FloatType) },
        minLng: { type: new GraphQLNonNull(FloatType) },
        maxLng: { type: new GraphQLNonNull(FloatType) },
    } */ },
    status: { type: StringType },
  },
});

export default searchListingType;
