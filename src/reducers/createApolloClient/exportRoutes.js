import { url, sitename } from '../../../config';
import { getRange } from '../../../helpers/dateRange';
import { isListExist, getBlockedDates } from './dbFunctions';

const ical = require('ical-generator');

const cal = ical({ domain: url, name: sitename });

const exportICalRoutes = (app) => {
  app.get('/export-calendar', async (req, res) => {
    const listId = req.query.id;
    let datesCollection = [];
    const listData = await isListExist(listId);
    if (listData) {
      const dates = await getBlockedDates(listId);
      if (dates && dates.length > 0) {
        datesCollection = getRange(dates);
        cal.clear();
        datesCollection.map((item) => {
          cal.createEvent({
            start: item.startDate,
            end: item.endDate,
            summary: `${sitename} - ${listData.title}`,
            description: listData.title,
            location: listData.city,
            url: `${url}/rooms/${listData.id}`,
          });
        });
      } else {
        cal.clear();
      }
    } else {
      cal.clear();
    }
    cal.serve(res);
  });
};

export default exportICalRoutes;
