import React from 'react';
import UserLayout from '../../components/Layout/UserLayout';
import PayoutContainer from './PayoutContainer';
import { getPayouts } from '../../actions/Payout/getPayouts';
import { graphql, gql, compose, useQuery } from 'react-apollo';
import fetch from '../../core/fetch';

// import { useQuery, gql } from '@apollo/client';
const title = 'Payout Preferences';

const getUserData = async () => {
  const query = `query userAccount{
     userAccount {
       userId,
       profileId,
       firstName,
       email,
       expiresYookassaToken
     }
   }`;

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      // variables: params,
    }),
    credentials: 'include',
  });
  const { data } = await resp.json();
  // console.log(data)
  return data;
  // let response = graphql
};

export default {

  path: '/user/payout',

  async action({ store, query }) {
    // From Redux Store
    const isAuthenticated = store.getState().runtime.isAuthenticated;
    const currentAccountId = query && query.account;
    let yookassaConnect;
    // const userData = graphql(getUserData, {
    //   options: {
    //     ssr: false,
    //     fetchPolicy: 'network-only',
    //   }});

    // const userData = store.getState().account.data;
    let userData = {};
    userData = await getUserData();
    if (userData.userAccount) {
      if (userData.userAccount.expiresYookassaToken != '0' && userData.userAccount.expiresYookassaToken != 'NULL') {
        yookassaConnect = userData.userAccount.expiresYookassaToken;
      }
    }
    // console.log('PAY USERRRRRRR', store.getState(), useQuery, userData)

    if (!isAuthenticated) {
      return { redirect: '/login' };
    }

    await store.dispatch(getPayouts(currentAccountId));

    return {
      title,
      component: <UserLayout><PayoutContainer title={title} currentAccountId={currentAccountId} yookassaConnect={yookassaConnect} /></UserLayout>,
    };
  },

};
