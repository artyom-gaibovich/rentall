import stripePackage from 'stripe';
import { payment } from '../../../config';

import { Reservation, TransactionHistory } from '../../../data/models';

const stripe = stripePackage(payment.stripe.secretKey);

export async function stripePayment(reservationId, payEmail, amount, currency, hostEmail, payoutId, hostId, paymentAttempt) {
  try {
    const updateAttempt = await Reservation.update({
      paymentAttempt: paymentAttempt + 1,
    }, {
      where: {
        id: reservationId,
      },
    });
    const payout = await stripe.transfers.create({
      amount: Math.round(amount),
      currency,
      destination: payEmail,
      transfer_group: 'Payout to Host',
      metadata: {
        reservationId,
        type: 'payout',
        hostEmail,
      },
    });

    if (payout && payout.id) {
      const createTransaction = await TransactionHistory.create({
        reservationId,
        userId: hostId,
        payoutId,
        payoutEmail: hostEmail,
        amount: Math.round(amount),
        currency,
        transactionId: payout.id,
        paymentMethodId: 2,
      });
      if (createTransaction) {
        return {
          status: 200,
        };
      }
    }
  } catch (error) {
    return {
      status: 400,
      errorMessage: error,
    };
  }
}
