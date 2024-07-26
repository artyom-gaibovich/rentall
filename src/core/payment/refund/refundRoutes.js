import paypal from 'paypal-rest-sdk';
import { payment as config } from '../../../config';
import { createTransaction } from './createTransaction';

const refundRoutes = (app) => {
  const paymentConfig = {
    api: {
      host: config.paypal.host,
      mode: config.paypal.hostMode,
      port: '',
      client_id: config.paypal.clientId,  // your paypal application client id
      client_secret: config.paypal.secret, // your paypal application secret id
    },
  };

  paypal.configure(paymentConfig.api);

  app.post('/refund', async (req, res) => {
    // paypal payment configuration.

    const sender_batch_id = Math.random().toString(36).substring(9);
    const reservationId = req.body.reservationId;
    const receiverEmail = req.body.receiverEmail;
    const receiverId = req.body.receiverId;
    const payerEmail = req.body.payerEmail;
    const payerId = req.body.payerId;
    const amount = req.body.amount;
    const currency = req.body.currency;

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
          receiver: receiverEmail,
          note: 'Thank you.',
          sender_item_id: reservationId,
        },
      ],
    };

    const sync_mode = 'false';

    paypal.payout.create(create_payout_json, sync_mode, async (error, payout) => {
      if (error) {
        res.send({ status: error.response });
        throw error;
      } else {
        const batchId = payout.batch_header.payout_batch_id;
        const batchStatus = payout.batch_header.batch_status;
        const fees = payout.batch_header.fees.value;
        const transactionId = payout.items[0].transaction_id;
        if (batchStatus && batchStatus === 'SUCCESS') {
          await createTransaction(
            reservationId,
            receiverEmail,
            receiverId,
            payerId,
            payerEmail,
            transactionId,
            amount,
            fees,
            currency,
          );
          res.send({ status: batchStatus });
        } else {
          res.send({ status: batchStatus });
        }
      }
    });
  });
};

export default refundRoutes;
