import searchGeoResultsType from '../types/searchGeoType';
import sequelize from '../sequelize';

import {GraphQLString as StringType,} from 'graphql';

const SearchGeo = {
    type: searchGeoResultsType,
    args: {
        query: {type: StringType}
    },
    async resolve(_, {query}) {
        try {
            const results = await sequelize.query(`
                SELECT DISTINCT locality, area, province
                FROM listing
                WHERE (locality IS NOT NULL AND locality LIKE :query)
                   OR (area IS NOT NULL AND area LIKE :query)
                   OR (province IS NOT NULL AND province LIKE :query)
            `, {
                replacements: {query: `%${query}%`},
                type: sequelize.QueryTypes.SELECT
            });
            const uniqueProvince = await sequelize.query(`SELECT DISTINCT province
                                                          from listing
                                                          where (province IS NOT NULL AND province LIKE :query);`, {
                replacements: {query: `%${query}%`},
                type: sequelize.QueryTypes.SELECT
            })
            const formattedUniqueProvince = uniqueProvince.map(result => {
                return {type: 'geo', displayName: `${result.province}`, value: `${result.province}`};
            })

            const uniqueArea = await sequelize.query(`SELECT DISTINCT area, province
                                                      from listing
                                                      where (area IS NOT NULL AND area LIKE :query)
                                                         OR (province IS NOT NULL AND province LIKE :query)
            ;`, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {query: `%${query}%`}
            })

            const formattedArea = uniqueArea.map(result => {
                return {
                    type: 'geo',
                    displayName: `${result.area}, ${result.province}`,
                    value: `${result.area}, ${result.province}`
                };
            })
            console.log(formattedArea)

            const formattedResults = results.map(result => {
                if (result.locality) {
                    return {
                        type: 'geo',
                        displayName: `${result.locality}, ${result.area}, ${result.province}`,
                        value: `${result.locality}, ${result.area}, ${result.province}`
                    };
                }
            });

            return {results: [...formattedUniqueProvince, ...formattedArea, ...formattedResults]};
        } catch (e) {
            console.error(e);
            return {results: []};
        }
    }
};

export default SearchGeo;
