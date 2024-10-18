import {
    BOOKING_PAYMENT_START,
    BOOKING_PAYMENT_SUCCESS,
    BOOKING_PAYMENT_ERROR,
} from '../../constants';

// Helper
import { convert } from '../../helpers/currencyConvertion';
// Stripe
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';

export function processCardAction(
  reservationId,
  listId,
  hostId,
  guestId,
  title,
  guestEmail,
  amount,
  currency,
  confirmPaymentIntentId,
) {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: BOOKING_PAYMENT_START,
      payload: {
        paymentLoading: true,
        reservationId,
      },
    });

    try {
      const rates = getState().currency.rates;
      const currentCurrency = (getState().currency.to) ? getState().currency.to : getState().currency.base;
      const baseCurrency = getState().currency.base;
      let convertedAmount = 0;

      convertedAmount = convert(baseCurrency, rates, amount, currency, currentCurrency);

      const reservationDetails = {
        reservationId,
        listId,
        hostId,
        guestId,
        guestEmail,
        title,
        amount: convertedAmount.toFixed(2),
        currency: currentCurrency,
      };
      const cardDetails = {};

      const { status, errorMessage } = await processStripePayment(
                'confirmReservation',
                cardDetails,
                reservationDetails,
                null,
                confirmPaymentIntentId,
            );

      if (status && status == 200) {
        dispatch({
          type: BOOKING_PAYMENT_SUCCESS,
          payload: {
            paymentLoading: false,
          },
        });

        return {
          status,
          errorMessage,
        };
      }
      dispatch({
        type: BOOKING_PAYMENT_ERROR,
        payload: {
          paymentLoading: false,
        },
      });
    } catch (error) {
      dispatch({
        type: BOOKING_PAYMENT_ERROR,
        payload: {
          error,
          paymentLoading: false,
        },
      });
      return false;
    }
    return true;
  };
}
