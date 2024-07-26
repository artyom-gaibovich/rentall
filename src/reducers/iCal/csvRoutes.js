import {
	completedTransactions,
	futureTransactions,
	grossEarnings,
} from './getTransactionsData';

import {
	users,
	reservations,
	listings,
} from './adminData';

const csv = require('csv-express');

const csvRoutes = (app) => {
  app.get('/export-transaction', async (req, res) => {
    if (!req.user) {
      res.redirect('/');
    } else {
      const type = req.query.type;
      const userId = req.query.userId;
      const base = req.query.base;
      const toCurrency = req.query.toCurrency;
      let data = [];
      if (userId && userId === req.user.id) {
        if (type === 'completed') {
          data = await completedTransactions(userId, base, toCurrency);
        } else if (type === 'future') {
          data = await futureTransactions(userId, base, toCurrency);
        } else if (type === 'grossEarnings') {
          data = await grossEarnings(userId, base, toCurrency);
        }
      }
      res.setHeader('Content-disposition', `attachment; filename=${type}-transactions.csv`);
      res.set('Content-Type', 'text/csv');
      res.csv(data, true);
    }
  });

  app.get('/export-admin-data', async (req, res) => {
    const type = req.query.type;
    const userType = req.query.usertype;
    const keyword = req.query.keyword;
    if (req.user && req.user.admin && type) {
      let data = [];
      if (type === 'users') {
        data = await users(keyword, userType);
      } else if (type === 'listings') {
        data = await listings();
      } else if (type === 'reservations') {
        data = await reservations();
      }
      res.setHeader('Content-disposition', `attachment; filename=${type}-data.csv`);
      res.set('Content-Type', 'text/csv');
      res.csv(data, true);
    } else {
      res.redirect('/');
    }
  });
};

export default csvRoutes;
