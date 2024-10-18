import { serverKey } from '../../config';
import { UserLogin } from '../../data/models';

const FCM = require('fcm-node');

const fcm = new FCM(serverKey);

const pushNotificationRoutes = (app) => {
  app.post('/push-notification', async (req, res) => {
    const notifyContent = {
      screenType: 'message',
      title: 'New Message',
      userType: 'guest',
      notificationId: 40300,
      message: 'John: dfsgsfdqwertyuiiiio',
      threadId: '12',
      guestId: '2',
      guestName: 'john',
      guestPicture: 'kmik',
      hostId: '123',
      hostName: 'nj j ',
      hostPicture: 'nmim',
      guestProfileId: '123',
      hostProfileId: '123',
            // "content_available": true
    };

    const userId = req.body.userId;
    const content = req.body.content;

    const notificationId = Math.floor(100000 + Math.random() * 900000);
    const deviceId = [];
    content.notificationId = notificationId;
    content.content_available = true;

    const getdeviceIds = await UserLogin.findAll({
      attributes: ['deviceId', 'deviceType'],
      where: {
        userId,
      },
      raw: true,
    });

    if (getdeviceIds && getdeviceIds.length > 0) {
      getdeviceIds.map(async (item) => {
        deviceId.push(item.deviceId);
      });
    }

    const message = {
      registration_ids: deviceId,
      notification: {
        title: content.title,
        body: content.message,
        content_available: true,
      },

      data: {
        content,
      },
    };

    fcm.send(message, (err, response) => {
      if (err) {
        // console.log('Something has gone wrong!', err);
      } else {
        // console.log('Successfully sent with response: ', response);
      }
      res.send({ status: response, errorMessge: err });
    });
  });
};

export default pushNotificationRoutes;
