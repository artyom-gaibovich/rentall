import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import FooterBlock from './FooterBlock';
import { restrictUrls } from '../../../helpers/adminPrivileges';

const title = 'Footer Block';

export default {

  path: '/siteadmin/home/footer-block',

  async action({ store }) {
    // From Redux Store
    const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    const adminPrivileges = store.getState().adminPrevileges.privileges && store.getState().adminPrevileges.privileges.privileges;

    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    // Admin restriction
    if (!restrictUrls('/siteadmin/home/footer-block', adminPrivileges)) {
      return { redirect: '/siteadmin' };
    }

    return {
      title,
      component: <AdminLayout><FooterBlock title={title} /></AdminLayout>,
    };
  },

};
