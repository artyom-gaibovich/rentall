import sharp from 'sharp';
import { profilePhotouploadDir } from '../../config';

const request = require('request');
const fs = require('fs');
const crypto = require('crypto');

const downloadRoute = (app) => {
  app.post('/uploadRemoteImage', (req, res) => {
    const url = req.body.url;
    request(url, { encoding: 'binary' }, (error, response, body) => {
      if (error) {
        res.send({ status: 400 });
      }
      const random = Math.random().toString(36).substring(9);
      const contentType = response.headers['content-type'];
      let ext;
      switch (contentType) {
        case 'image/jpeg':
          ext = '.jpeg';
          break;
        case 'image/png':
          ext = '.png';
          break;
      }
      if (ext) {
        const filename = random + ext;
        const destination = profilePhotouploadDir + filename;
        fs.writeFile(destination, body, 'binary', async (err) => {
					// small - 100 * 100
          const smallImage = await new Promise((resolve, reject) => {
            sharp(destination)
							.rotate()
							.resize(100, 100)
							// .crop(sharp.strategy.entropy)
							.toFile(`${profilePhotouploadDir}small_${filename}`, (err) => {
  // console.log('Error from resizing files', err);
  if (destination) {
    resolve(destination);
  } else {
    reject(error);
  }
});
          });

					// medium - 255 * 255
          const mediumImage = await new Promise((resolve, reject) => {
            sharp(destination)
							.rotate()
							.resize(255, 255)
							// .crop(sharp.strategy.entropy)
							.toFile(`${profilePhotouploadDir}medium_${filename}`, (err) => {
  // console.log('Error from resizing files', err);
  if (destination) {
    resolve(destination);
  } else {
    reject(error);
  }
});
          });

          if (err) {
            res.send({ status: 400 });
          }
        });
        res.send({ filename, status: 200 });
      } else {
        res.send({ status: 400 });
      }
    });
  });
};

export default downloadRoute;
