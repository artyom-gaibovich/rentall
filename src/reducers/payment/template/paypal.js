import paypal from 'paypal-rest-sdk';
import { payment as config } from '../../config';
import { updateReservation } from './updateReservation';
import { createTransaction } from './createTransaction';
import { createThread } from './createThread';
import { blockDates } from './blockDates';
import { emailBroadcast } from './email';

const paypalRoutes = (app) => {
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

  app.get('/cancel', async (req, res) => {
    const reservationId = req.query.id;

    res.redirect(`/payment/${reservationId}`);
  });

  app.post('/ipn_handler', async (req, res) => {
    let itemSKU,
      payerEmail,
      payerId,
      receiverEmail,
      receiverId,
      transactionId,
      total,
      currency,
      transactionFee,
      ipn_track_id;
    itemSKU = req.body.item_number1;
    payerEmail = req.body.payer_email;
    payerId = req.body.payer_id;
    receiverEmail = req.body.receiver_email;
    receiverId = req.body.receiver_id;
    transactionId = req.body.txn_id;
    total = req.body.payment_gross;
    if (req.body.payment_fee != undefined) {
      transactionFee = req.body.payment_fee;
    }
    currency = req.body.mc_currency;
    ipn_track_id = req.body.ipn_track_id;
    if (req.body.payment_status === 'Completed') {
      await updateReservation(itemSKU);
      await createTransaction(
        itemSKU,
        payerEmail,
        payerId,
        receiverEmail,
        receiverId,
        transactionId,
        total,
        transactionFee,
        currency,
        ipn_track_id,
      );
      await createThread(itemSKU);
      await blockDates(itemSKU);
      await emailBroadcast(itemSKU);
    }
    res.send('Payment status from ipn_handler.');
  });

  app.get('/success', (req, res) => {
    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;
    const details = { payer_id: payerId };

    paypal.payment.execute(paymentId, details, async (error, payment) => {
      if (error) {
        // console.log(error);
      } else {
        let amount,
          payee,
          item_list,
          related_resources,
          rrAmount,
          rrTranscationFee,
          itemSKU,
          transactionId;
        payment.transactions.map((item) => {
          amount = item.amount;
          payee = item.payee;
          item_list = item.item_list;
          related_resources = item.related_resources;
          related_resources.map((relatedItem) => {
            transactionId = relatedItem.sale.id;
            rrAmount = relatedItem.sale.amount;
            if (relatedItem.sale.transaction_fee != undefined) {
              rrTranscationFee = relatedItem.sale.transaction_fee.value;
            }
          });
        });
        item_list.items.map((itemData) => {
          itemSKU = Number(itemData.sku);
        });

        const payerEmail = payment.payer.payer_info.email;
        const payerId = payment.payer.payer_info.payer_id;
        const receiverEmail = payee.email;
        const receiverId = payee.merchant_id;
        const total = rrAmount.total;
        const transactionFee = rrTranscationFee;
        const currency = rrAmount.currency;
        /* // console.log('itemSKU', itemSKU);
        // console.log('payerEmail', payerEmail);
        // console.log('payerId', payerId);
        // console.log('receiverEmail', receiverEmail);
        // console.log('receiverId', receiverId);
        // console.log('transactionId', transactionId);
        // console.log('total', total);
        // console.log('transactionFee', transactionFee);
        // console.log('currency', currency);
        res.send('success'); */

        await updateReservation(itemSKU);
        await createTransaction(
          itemSKU,
          payerEmail,
          payerId,
          receiverEmail,
          receiverId,
          transactionId,
          total,
          transactionFee,
          currency,
          '',
        );
        await createThread(itemSKU);
        await blockDates(itemSKU);
        await emailBroadcast(itemSKU);
        res.redirect(`${config.paypal.redirectURL.success}/${itemSKU}`);
      }
    });
  });

  app.post('/paynow', (req, res) => {
    // paypal payment configuration.
    const payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: config.paypal.returnURL,
        cancel_url: `${config.paypal.cancelURL}?id=${req.body.reservationId}`,
      },
      transactions: [{
        item_list: {
          items: [{
            name: req.body.description,
            sku: req.body.reservationId,
            price: req.body.amount,
            currency: req.body.currency,
            quantity: 1,
          }],
        },
        amount: {
          currency: req.body.currency,
          total: req.body.amount,
        },
        description: 'This is the payment description.',
      }],

    };

    paypal.payment.create(payment, (error, payment) => {
      if (error) {
        // console.log('error from paynow', error);
      } else if (payment.payer.payment_method === 'paypal') {
        req.paymentId = payment.id;
        let redirectUrl;
        for (let i = 0; i < payment.links.length; i++) {
          const link = payment.links[i];
          if (link.method === 'REDIRECT') {
            redirectUrl = link.href;
          }
        }
        res.send({ redirect: redirectUrl });
      }
    });
  });
};

export default paypalRoutes;
