import React from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import TrustAndVerification from './TrustAndVerification';
import { emailVerification } from '../../actions/manageUserVerification';

const title = 'Trust and Verification';

export default {

  path: '/user/verification',

  action({ store, query }) {
    // From Redux Store
    const isAuthenticated = store.getState().runtime.isAuthenticated;


    if (!isAuthenticated) {
      if ('confirm' in query && 'email' in query) {
        // return { redirect: '/login?verification=email' };
        return { redirect: `/login?refer=/user/verification---confirm=${query.confirm}--email=${query.email}` };
      }
      return { redirect: '/login' };
    }

    const userId = store.getState().account.data.userId;

    const email = store.getState().account.data.email;

    if ('confirm' in query && 'email' in query) {
      if (email !== query.email) {
        return { redirect: `/login?refer=/user/verification---confirm=${query.confirm}--email=${query.email}` };
      }
      store.dispatch(emailVerification(query.confirm, query.email, userId));
    }

    return {
      title,
      component: <UserLayout><TrustAndVerification title={title} /></UserLayout>,
    };
  },

};
