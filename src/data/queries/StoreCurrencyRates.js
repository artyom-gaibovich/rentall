
import {
  GraphQLString as StringType,
} from 'graphql';

// Type
import CurrencyType from '../types/CurrencyType';

// Sequelize models
import { CurrencyRates } from '../../data/models';

const StoreCurrencyRates = {

  type: CurrencyType,

  args: {
    rates: { type: StringType },
    base: { type: StringType },
  },

  async resolve({ request, response }, { rates, base }) {
    const currencyData = JSON.parse(rates);

    const baseData = {
      currencyCode: base,
      rate: 1.00,
    };
    const ratesData = Object.keys(currencyData).map(data => ({ currencyCode: data, rate: currencyData[data] }));
    ratesData.push(baseData);
    if (ratesData.length > 0) {
      await CurrencyRates.truncate();
      const updateRates = await CurrencyRates.bulkCreate(ratesData);
      return {
        status: 'success',
      };
    }
    return {
      status: 'failed',
    };
  },
};

export default StoreCurrencyRates;
