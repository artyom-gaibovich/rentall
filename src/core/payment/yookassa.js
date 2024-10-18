import { Reservation, User } from '../../data/models';
import { blockDates } from './blockDates';
import { createThread } from './createThread';
import { createTransaction } from './createTransaction';
import { emailBroadcast } from './email';
import { updateReservation } from './updateReservation';
import { auth, payment as config } from '../../config';
import jwt from 'jsonwebtoken';

const axios = require('axios');

const getWebHooks = async (props) => {
  try {
    const { data } = await axios.get(
            'https://api.yookassa.ru/v3/webhooks',
      {
        headers: {
          'Idempotence-Key': Date.now(),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.user.yookassaToken}`,
        },
      },
        );
        // console.log("WEBHOOKS DATA", data)
    return data;
  } catch (e) {
        // console.log('e', e)
    return false;
  }
};
const createWebHook = async (props) => {
  try {
    const { data } = await axios.post(
            'https://api.yookassa.ru/v3/webhooks',
            JSON.stringify({
              event: 'payment.succeeded',
              url: 'https://goodtrip.ru/pay',
            }),
      {
        headers: {
          'Idempotence-Key': Date.now(),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.user.yookassaToken}`,
        },
      },
        );
        // console.log("WEBHOOKS CREATE RESPONSE", data)

    return data;
  } catch (e) {
        // console.log('WEBHOOKS ERR', e)
  }
};
const findOrCreateWebHook = async (props) => {
  const webhooks = await getWebHooks(props);
  if (!webhooks.items || !webhooks.items.length || webhooks.items.length == 0) {
    await createWebHook(props);
  }
};

const yookassaRoutes = (app) => {
  app.post('/yookassa/reservation', async (req, res) => {
    const reservationDetails = req.body.reservationDetails;
    const { id_token } = req.cookies;
    const decodeToken = jwt.verify(id_token, auth.jwt.secret);
    const idUser = decodeToken.id;

    const reservation = await Reservation.findById(reservationDetails.reservationId);
    const user = await User.findById(reservation.hostId);

        // console.log(user);
    if (!user.yookassaToken) {
      console.log('WTF! WHERE is user.yookassaToken', user);
            // // console.log(e);
      res.status(500).send();
    }
    await findOrCreateWebHook({
      user,
    });
    try {
      const { data } = await axios.post(
                'https://api.yookassa.ru/v3/payments',
                JSON.stringify({
                  amount: {
                    value: reservationDetails.amount,
                    currency: reservationDetails.currency,
                  },
                  confirmation: {
                    type: 'redirect',
                    return_url: 'https://goodtrip.ru/trips/current',
                  },
                  capture: true,
                  metadata: {
                    reservation_id: reservationDetails.reservationId,
                  },
                  description: 'Test',
                }),
        {
          headers: {
            'Idempotence-Key': Date.now(),
            'Content-Type': 'application/json',
                   	    Authorization: `Bearer ${user.yookassaToken}`,
		    },
                    // auth: {
                    //     username: config.yookassa.shop_id,
                    //     password: config.yookassa.secret_key
                    // }
        },
            );

      const { status, confirmation } = data;

            // console.log(data);

      res.send({ status, confirmation });
    } catch (e) {
            // console.log(e);
      res.status(500).send();
    }
  });

  app.post('/pay', async (req, res) => {
    const { type, object } = req.body;
    const { id, status, amount, metadata } = object;

        // console.log('yookassa hoook', object);

    if (type === 'notification' && metadata.reservation_id && status === 'succeeded') {
      const { reservation_id } = metadata;

      const reservation = await Reservation.findById(reservation_id);
      const payer = await User.findById(reservation.guestId);
      const receiver = await User.findById(reservation.hostId);

      await updateReservation(reservation_id);
      await createTransaction(
                reservation_id,
                payer.email,
                payer.id,
                receiver.email,
                receiver.id,
                id,
                amount.value,
                0.00,
                amount.currency,
                '',
            );
      await createThread(reservation_id);
      await blockDates(reservation_id);
      await emailBroadcast(reservation_id);
    }
    res.send();
  });
};

export default yookassaRoutes;
