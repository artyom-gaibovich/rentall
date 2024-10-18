import SiteSettingsType from '../../../types/siteadmin/SiteSettingsType';
import { SiteSettings } from '../../../models';

const removeHomeLogo = {

  type: SiteSettingsType,

  async resolve({ request }) {
    if (request.user && request.user.admin == true) {
      const removeHomeLogo = await SiteSettings.destroy({
        where: {
          title: 'Home Page Logo',
        },
      });

      if (removeHomeLogo) {
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

export default removeHomeLogo;
