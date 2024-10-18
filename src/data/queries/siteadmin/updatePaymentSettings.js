import PaymentType from '../../types/PaymentType';
import { PaymentSettings } from '../../../data/models';

import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';

const updatePaymentSettings = {

  type: PaymentType,

  args: {
    id: { type: IntType },
    paymentName: { type: StringType },
    paymentStatus: { type: StringType },
    paymentMode: { type: StringType },
    email: { type: StringType },
    APIUserId: { type: StringType },
    APIPassword: { type: StringType },
    APISecret: { type: StringType },
    AppId: { type: StringType },
  },

  async resolve({ request },
    {
      id,
      paymentName,
      paymentStatus,
      paymentMode,
      email,
      APIUserId,
      APIPassword,
      APISecret,
      AppId,
    }) {
    if (request.user && request.user.admin == true) {
      let isPaymentSettingsUpdated = false;

      const updatePayment = await PaymentSettings.update(
        {
          paymentName: 'paypal',
          paymentStatus,
          paymentMode,
          email,
          APIUserId,
          APIPassword,
          APISecret,
          AppId,
        },
        {
          where: {
            id,
          },
        },
      )
        .then((instance) => {
          // Check if any rows are affected
          if (instance > 0) {
            isPaymentSettingsUpdated = true;
          }
        });

      if (isPaymentSettingsUpdated) {
        return {
          status: 'success',
        };
      }
      return {
        status: 'failed',
      };
    }
    return {
      status: 'failed',
    };
  },
};

export default updatePaymentSettings;
