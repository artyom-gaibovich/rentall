import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import SearchSettings from './SearchSettings';
import { restrictUrls } from '../../../helpers/adminPrivileges';


const title = 'Search Settings';

export default {

  path: '/siteadmin/settings/search',

  async action({ store }) {
    // From Redux Store
    const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    const adminPrivileges = store.getState().adminPrevileges.privileges && store.getState().adminPrevileges.privileges.privileges;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    // Admin restriction
    if (!restrictUrls('/siteadmin/settings/search', adminPrivileges)) {
      return { redirect: '/siteadmin' };
    }

    return {
      title,
      component: <AdminLayout><SearchSettings title={title} /></AdminLayout>,
    };
  },

};
