import paypal from 'paypal-rest-sdk';

import { payment } from '../../../config';

import { Reservation } from '../../../data/models';
import { createTransactionHistory } from '../../payment/payout/createTransactionHistory';


const paymentConfig = {
  api: {
    host: payment.paypal.host,
    mode: payment.paypal.hostMode,
    port: '',
    client_id: payment.paypal.clientId,  // your paypal application client id
    client_secret: payment.paypal.secret, // your paypal application secret id
  },
};
paypal.configure(paymentConfig.api);

export async function paypalTransaction(reservationId, hostId, amount, currency, hostEmail, paymentAttempt, payoutId) {
  try {
    let status = 200,
      errorMessage;
    const sender_batch_id = Math.random().toString(36).substring(9);
    amount = Math.round(amount);

    const updateAttempt = await Reservation.update({
      paymentAttempt: paymentAttempt + 1,
    }, {
      where: {
        id: reservationId,
      },
    });

    const create_payout_json = {
      sender_batch_header: {
        sender_batch_id,
        email_subject: 'You have a payment',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: amount,
            currency,
          },
          receiver: hostEmail,
          note: 'Thank you.',
          sender_item_id: reservationId,
        },
      ],
    };

    const sync_mode = 'false';
    paypal.payout.create(create_payout_json, sync_mode, async (error, payout) => {
      if (error) {
        status = 400;
        errorMessage = error;
        throw error;
      } else {
        const batchId = payout.batch_header.payout_batch_id;
        let batchStatus = payout.batch_header.batch_status;
        let fees = payout.batch_header.fees && response.batch_header.fees.value;
        if (batchStatus && batchStatus === 'SUCCESS') {
          await createTransactionHistory(
                        reservationId,
                        hostEmail,
                        payoutId,
                        amount,
                        fees,
                        currency,
                        hostId,
                        1,
                    );
          status = 200;
        } else if (batchStatus === 'PENDING') {
          const getPayoutInfo = paypal.payout.get(batchId, async (getError, getResponse) => {
            if (getError) {
              status = 400,
                                errorMessage = getError.response && getError.response.message;
            } else {
              batchStatus = getResponse.batch_header.batch_status;
              if (getResponse && getResponse.batch_header && (batchStatus === 'PENDING' || batchStatus === 'SUCCESS')) {
                fees = getResponse.batch_header.fees && getResponse.batch_header.fees.value;

                await createTransactionHistory(
                                        reservationId,
                                        hostEmail,
                                        payoutId,
                                        amount,
                                        fees,
                                        currency,
                                        hostId,
                                        1,
                                    );
              }
              status = 200;
            }
          });
        }
      }
    });
    return {
      status,
      errorMessage,
    };
  } catch (error) {
    return {
      status: 400,
      errorMessage: error,
    };
  }
}
