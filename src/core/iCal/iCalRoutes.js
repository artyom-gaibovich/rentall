import { findURL, storeCalendar } from './dbFunctions';
import { getDates } from '../../helpers/dateRange';

const ical = require('ical');

const axios = require('axios');

const iCalRoutes = (app) => {
  app.post('/import-calendar', async (req, res) => {
    if (!req.user) {
      res.redirect('/');
    } else {
      const listId = req.body.data.listId;
      const url = req.body.data.url;
      const name = req.body.data.name;
      const calendarId = req.body.data.calendarId;
      const toSearch = ['text/calendar', 'application/octet-stream', 'application/ics'];
      const toSearchHtml = 'text/html';

      if (!calendarId) {
        const isURLAvailable = await findURL(url, listId);
        if (isURLAvailable) {
          res.send({ status: 409 });
          return;
        }
      }

      axios.get(url).then(async (response) => {
				// handle success
        if (response && response.data) {
          let contentType = response.headers['content-type'];
          contentType = contentType.includes(';') ? contentType.split(';')[0] : contentType;
          const dataIndex = toSearch.indexOf(contentType); const dataIndexHtml = contentType.search(toSearchHtml);

          if (dataIndex > -1 || dataIndexHtml > -1) {
            let calendarData,
              calendarDataId;
            if (!calendarId) {
              calendarData = await storeCalendar(url, listId, name);
              calendarDataId = calendarData.id;
            } else {
              calendarDataId = calendarId;
            }
            const data = ical.parseICS(response.data);
            const blockedDateCollection = [];
            for (const k in data) {
              if (data.hasOwnProperty(k)) {
                const ev = data[k];
                if (ev.start && ev.end) {
									// if (ev.start.getDate() === ev.end.getDate()) {
                  if (ev.start.getDate() === ev.end.getDate() && ev.start.getFullYear() === ev.end.getFullYear() && ev.start.getMonth() === ev.end.getMonth()) {
                    blockedDateCollection.push(ev.start);
                  } else {
                    const range = getDates(ev.start, ev.end);
                    range.map(async (item) => {
                      blockedDateCollection.push(item);
                    });
                  }
                }
              }
            }
            res.send({ status: 200, blockedDates: blockedDateCollection, calendarDataId });
          } else {
            res.send({ status: 400 });
          }
        } else {
          res.send({ status: 400 });
        }
      }).catch((error) => {
        res.send({ status: 400 });
      });
    }
  });
};

export default iCalRoutes;
