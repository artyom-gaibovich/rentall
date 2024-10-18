import React from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import AddPayoutFailure from './AddPayoutFailure';

const title = 'Payout Failure';

export default {

  path: '/user/payout/failure',

  action({ store, query }) {
    // From Redux Store
    const isAuthenticated = store.getState().runtime.isAuthenticated;
    const currentAccountId = query && query.account;

    if (!isAuthenticated) {
      return { redirect: '/login' };
    }

    return {
      title,
      component: <UserLayout><AddPayoutFailure title={title} currentAccountId={currentAccountId} /></UserLayout>,
    };
  },

};
