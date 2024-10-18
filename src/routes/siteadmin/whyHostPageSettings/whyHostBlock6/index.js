import React from 'react';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import WhyHostBlock6 from './WhyHostBlock6';
import { restrictUrls } from '../../../../helpers/adminPrivileges';

const title = 'Why Become Host Block 6';

export default {

  path: '/siteadmin/whyHost/Block6',

  async action({ store }) {
    const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    const adminPrivileges = store.getState().adminPrevileges.privileges && store.getState().adminPrevileges.privileges.privileges;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    if (!restrictUrls('/siteadmin/whyHost/Block6', adminPrivileges)) {
      return { redirect: '/siteadmin' };
    }

    return {
      title,
      component: <AdminLayout><WhyHostBlock6 title={title} /></AdminLayout>,
    };
  },

};
