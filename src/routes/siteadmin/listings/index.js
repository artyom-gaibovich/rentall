import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import Listings from './Listings';
import { restrictUrls } from '../../../helpers/adminPrivileges';


const title = 'Listings Management';

export default {

  path: '/siteadmin/listings',

  async action({ store }) {
    // From Redux Store
    const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    const adminPrivileges = store.getState().adminPrevileges.privileges && store.getState().adminPrevileges.privileges.privileges;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    // Admin restriction
    if (!restrictUrls('/siteadmin/listings', adminPrivileges)) {
      return { redirect: '/siteadmin' };
    }

    return {
      title,
      component: <AdminLayout><Listings title={title} /></AdminLayout>,
    };
  },

};
