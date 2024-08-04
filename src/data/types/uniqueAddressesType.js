import {GraphQLString as StringType} from "graphql/type/scalars";


const searchListingType = new ObjectType({
    name : 'UniqueAddresses',
    fields: {
        count: { type: StringType },
        status: { type: StringType },
    }
})
