import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import ImageBanner from './ImageBanner';
import { restrictUrls } from '../../../helpers/adminPrivileges';


const title = 'Home page Banner';

export default {

  path: '/siteadmin/home/banner',

  async action({ store }) {
    // From Redux Store
    const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    const adminPrivileges = store.getState().adminPrevileges.privileges && store.getState().adminPrevileges.privileges.privileges;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    // Admin restriction
    if (!restrictUrls('/siteadmin/home/banner', adminPrivileges)) {
      return { redirect: '/siteadmin' };
    }

    return {
      title,
      component: <AdminLayout><ImageBanner title={title} /></AdminLayout>,
    };
  },

};
