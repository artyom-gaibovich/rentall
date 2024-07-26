import { documentuploadDir } from '../config';
import multer from 'multer';
import bodyParser from 'body-parser';
import sharp from 'sharp';

const crypto = require('crypto');
const fs = require('fs');
const fse = require('fs-extra');


const storage = multer.diskStorage({
  destination: documentuploadDir,
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

        case 'application/pdf':
          ext = '.pdf';
          break;
      }

      cb(null, raw.toString('hex') + ext);
    });
  },
});

const upload = multer({ storage });

function removeFile(fileName, filePath) {
  if (fs.existsSync(filePath + fileName)) {
    // Original
    fs.unlink(filePath + fileName, (err) => {
      if (err) throw err;
      // console.log('successfully deleted');
    });
  }
}

const documentUpload = (app) => {
  app.post('/documents', (req, res, next) => {
    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, upload.array('file'), async (req, res, next) => {
    const files = req.files;

    res.send({ status: 'SuccessFully uploaded!', files });
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/deleteDocuments', (req, res, next) => {
    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, async (req, res) => {
    const filePath = documentuploadDir;
    const fileName = req.body.fileName;
    await removeFile(fileName, filePath);
    res.send({ status: 'Got your file to remove!' });
  });

  app.post('/removeMultiFiles', (req, res, next) => {
    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, async (req, res) => {
    const files = req.body.files;
    const filePath = documentuploadDir;
    if (files != undefined && files.length > 0) {
      files.map(async (item) => {
        await removeFiles(item.name, filePath);
      });
      res.send({ status: 'SuccessFully removed!' });
    }
    res.send({ status: 'No files to remove' });
  });
};

export default documentUpload;
