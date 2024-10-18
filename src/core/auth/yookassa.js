import passport from 'passport';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Listing, User, Yookassa } from '../../data/models';
import request from 'request';
import fetch from 'node-fetch';
import { response } from 'express';
import { btoa, Buffer } from 'buffer';
import qs from 'qs';
import { auth } from '../../config';

const yookassaAuth = (app) => {
  app.get('/user/login/yookassa', (req, res) => {
    res.redirect(
      `https://yookassa.ru/oauth/v2/authorize?client_id=${process.env.YOOKASSA_CLIENT_ID}&response_type=code`,
    );
  });

  app.all('/yookassa-callback', async (req, res) => {
    const { query, cookies } = req;

    const { id_token } = cookies;
    // console.log('YOOKASSA CALLBACK', req.query)
    if (!id_token) return res.redirect('/login');

    if (query.code) {
      const decodeToken = jwt.verify(id_token, auth.jwt.secret);
      const idUser = decodeToken.id;

      const instance = axios.create({
        baseURL: 'https://yookassa.ru/oauth/v2/token',
      });

      instance.defaults.headers.Accept = 'application/x-www-form-urlencoded';
      instance.defaults.headers.common.Authorization = `Basic ${Buffer.from(
        `${process.env.YOOKASSA_CLIENT_ID
          }:${
          process.env.YOOKASSA_CLIENT_SECRET}`,
        'utf-8',
      ).toString('base64')}`;

      axios
        .post(
          'https://yookassa.ru/oauth/v2/token',
          qs.stringify({
            grant_type: 'authorization_code',
            code: `${query.code}`,
          }),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
                `${process.env.YOOKASSA_CLIENT_ID
                  }:${
                  process.env.YOOKASSA_CLIENT_SECRET}`,
                'utf-8',
              ).toString('base64')}`,
          },
        },
        )
        .then((response) => {
          console.log('token response', response);
          User.update(
            {
              yookassaToken: response.data.access_token,
              expiresYookassaToken: response.data.expires_in,
            },
            {
              where: {
                id: idUser,
              },
            },
          )
            .then((result) => {
              res.cookie('yookassaConnect', true, {
                maxAge: 1000 * 60 * 60 * 24 * 180,
              });
              res.redirect('/user/payout');
            })
            .catch((err) => {
              // console.log("YOOKASSA ERR :80", err)
              res.end(`Произошла ошибка при записи токена. Err:${err}`);
            });
        })
        .catch((err) => {
          // console.log("YOOKASSA ERR :85", err)

          res.end(`Произошла ошибка при запросе токена. Err: ${err.response.data}`);
        });
    } else {
      res.redirect(
        `https://yookassa.ru/oauth/v2/authorize?client_id=${process.env.YOOKASSA_CLIENT_ID}&response_type=code`,
      );
    }
  });
};

export default yookassaAuth;
