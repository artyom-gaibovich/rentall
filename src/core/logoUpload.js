
import { logouploadDir } from '../config';
import multer from 'multer';

import bodyParser from 'body-parser';
import sharp from 'sharp';

const crypto = require('crypto');
const fs = require('fs');
const fse = require('fs-extra');

const storage = multer.diskStorage({
  destination: logouploadDir,
  filename(req, file, cb) {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return cb(err);

      let ext;

      switch (file.mimetype) {
        case 'image/jpeg':
          ext = '.jpeg';
          break;
        case 'image/png':
          ext = '.png';
          break;
      }

      cb(null, raw.toString('hex') + ext);
    });
  },
});

const upload = multer({ storage });

function removeFiles(fileName, filePath) {
  if (fs.existsSync(filePath + fileName)) {
    // Original
    fs.unlink(filePath + fileName, (err) => {
      if (err) throw err;
      // console.log(fileName, 'successfully deleted');
    });
  }

  if (fs.existsSync(`${filePath}small_${fileName}`)) {
    // small
    fs.unlink(`${filePath}small_${fileName}`, (err) => {
      if (err) throw err;
      // console.log(`small_${fileName}`, 'successfully deleted');
    });
  }

  if (fs.existsSync(`${filePath}medium_${fileName}`)) {
    // medium
    fs.unlink(`${filePath}medium_${fileName}`, (err) => {
      if (err) throw err;
      // console.log(`medium_${fileName}`, 'successfully deleted');
    });
  }
}

const logoUpload = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/removeLogoFile', (req, res, next) => {
    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, async (req, res) => {
    const filePath = logouploadDir;
    const fileName = req.body.fileName;

    await removeFiles(fileName, filePath);
    res.send({ status: 'Got your file to remove!' });
  });

  app.post('/uploadLogo', (req, res, next) => {
    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, upload.single('file'), async (req, res, next) => {
    const file = req.file;

    // small - 50 * 50
    sharp(file.path)
      .resize(50, 50)
      // .crop(sharp.strategy.entropy)
      .toFile(`${logouploadDir}small_${file.filename}`, (err) => {
        // console.log('Error from resizing files', err);
      });

    // medium - 100 * 100
    sharp(file.path)
      .resize(100, 100)
      // .crop(sharp.strategy.entropy)
      .toFile(`${logouploadDir}medium_${file.filename}`, (err) => {
        // console.log('Error from resizing files', err);
      });

    res.send({ status: 'SuccessFully uploaded!', file });
  });

  app.post('/uploadEmailLogo', (req, res, next) => {
    // console.log('file name upload emaill logo', req);

    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, upload.single('file'), async (req, res, next) => {
    const file = req.file;

    // small - 50 * 50
    sharp(file.path)
      .resize(50, 50)
      // .crop(sharp.strategy.entropy)
      .toFile(`${logouploadDir}small_${file.filename}`, (err) => {
        // console.log('Error from resizing files', err);
      });

    // medium - 100 * 100
    sharp(file.path)
      .resize(100, 100)
      // .crop(sharp.strategy.entropy)
      .toFile(`${logouploadDir}medium_${file.filename}`, (err) => {
        // console.log('Error from resizing files', err);
      });

    res.send({ status: 'SuccessFully uploaded!', file });
  });

  app.post('/removeEmailLogo', (req, res, next) => {
    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, async (req, res) => {
    const filePath = logouploadDir;
    const fileName = req.body.fileName;

    await removeFiles(fileName, filePath);
    res.send({ status: 'Got your file to remove!' });
  });
};

export default logoUpload;
