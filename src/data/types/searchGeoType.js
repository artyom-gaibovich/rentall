import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLList as List,
} from 'graphql';

const searchGeoType = new ObjectType({
    name: 'Geo',
    fields: {
        type: { type: StringType },
        displayName: { type: StringType },
        value: { type: StringType },
    },
});

const searchGeoResultsType = new ObjectType({
    name: 'SearchGeoResults',
    fields: {
        results: { type: new List(searchGeoType) },
    },
});

export default searchGeoResultsType;
