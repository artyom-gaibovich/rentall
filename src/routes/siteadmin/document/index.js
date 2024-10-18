import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import Document from './Document';
import { restrictUrls } from '../../../helpers/adminPrivileges';


const title = 'Document Verification Management';

export default {

  path: '/siteadmin/document',

  async action({ store }) {
    // From Redux Store
    const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
    const adminPrivileges = store.getState().adminPrevileges.privileges && store.getState().adminPrevileges.privileges.privileges;


    if (!isAdminAuthenticated) {
      return { redirect: '/siteadmin/login' };
    }

    // Admin restriction
    if (!restrictUrls('/siteadmin/document', adminPrivileges)) {
      return { redirect: '/siteadmin' };
    }

    return {
      title,
      component: <AdminLayout><Document title={title} /></AdminLayout>,
    };
  },

};
