import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import WriteReview from './WriteReview';
import { restrictUrls } from '../../../helpers/adminPrivileges';


const title = 'Admin Reviews';

export default {

  path: '/siteadmin/write-reviews',

  async action({ store }) {
        // From Redux Store
    const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    const adminPrivileges = store.getState().adminPrevileges.privileges && store.getState().adminPrevileges.privileges.privileges;


    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

        // Admin restriction
    if (!restrictUrls('/siteadmin/write-reviews', adminPrivileges)) {
      return { redirect: '/siteadmin' };
    }

    return {
      title,
      component: <AdminLayout><WriteReview title={title} /></AdminLayout>,
    };
  },

};
