import SiteSettingsType from '../../../types/siteadmin/SiteSettingsType';
import { SiteSettings } from '../../../models';

const removeEmailLogo = {

  type: SiteSettingsType,

  async resolve({ request }) {
    if (request.user && request.user.admin == true) {
      const removeEmailLogo = await SiteSettings.destroy({
        where: {
          title: 'Email Logo',
        },
      });

      if (removeEmailLogo) {
        return {
          status: 'success',
        };
      }
      return {
        status: 'failed',
      };
    }
    return {
      status: 'not logged in',
    };
  },
};

export default removeEmailLogo;
