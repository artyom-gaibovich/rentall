
import { fileuploadDir } from '../config';
import multer from 'multer';

import bodyParser from 'body-parser';
import sharp from 'sharp';

const crypto = require('crypto');
const fs = require('fs');
const fse = require('fs-extra');


const storage = multer.diskStorage({
  destination: fileuploadDir,
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
      // console.log('successfully deleted');
    });
  }

  if (fs.existsSync(`${filePath}small_${fileName}`)) {
    // small
    fs.unlink(`${filePath}small_${fileName}`, (err) => {
      if (err) throw err;
      // console.log('successfully deleted');
    });
  }

  if (fs.existsSync(`${filePath}x_small_${fileName}`)) {
    // x_small
    fs.unlink(`${filePath}x_small_${fileName}`, (err) => {
      if (err) throw err;
      // console.log('successfully deleted');
    });
  }


  if (fs.existsSync(`${filePath}x_medium_${fileName}`)) {
    // x_medium
    fs.unlink(`${filePath}x_medium_${fileName}`, (err) => {
      if (err) throw err;
      // console.log('successfully deleted');
    });
  }

  if (fs.existsSync(`${filePath}x_large_${fileName}`)) {
    // x_large
    fs.unlink(`${filePath}x_large_${fileName}`, (err) => {
      if (err) throw err;
      // console.log('successfully deleted');
    });
  }

  if (fs.existsSync(`${filePath}xx_large_${fileName}`)) {
    // xx_large
    fs.unlink(`${filePath}xx_large_${fileName}`, (err) => {
      if (err) throw err;
      // console.log('successfully deleted');
    });
  }

  if (fs.existsSync(`${filePath}placeholder_${fileName}`)) {
    // placeholder
    fs.unlink(`${filePath}placeholder_${fileName}`, (err) => {
      if (err) throw err;
      // console.log('successfully deleted');
    });
  }
}

const fileUpload = (app) => {
  app.post('/photos', (req, res, next) => {
    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, upload.array('file'), async (req, res, next) => {
    const files = req.files;

    const metadata = await sharp(files[0].path).metadata();

    // small - 101 * 67
    const smallImage = await new Promise((resolve, reject) => {
      sharp(files[0].path)
        .rotate()
        .resize(101, null)
        .extend({
          top: 4,
          bottom: 4,
          left: 4,
          right: 4,
          background: '#FFFFFF',
        })
        // .crop(sharp.strategy.entropy)
        .toFile(`${fileuploadDir}small_${files[0].filename}`, (err) => {
          if (files) {
            resolve(files);
          } else {
            reject(error);
          }
          // console.log('Error from resizing files', err);
        });
    });

    // x_small - 300 * 144
    const xSmallImage = await new Promise((resolve, reject) => {
      sharp(files[0].path)
        .rotate()
        .resize(300, null)
        .extend({
          top: 6,
          bottom: 6,
          left: 6,
          right: 6,
          background: '#FFFFFF',
        })
        // .crop(sharp.strategy.entropy)
        .toFile(`${fileuploadDir}x_small_${files[0].filename}`, (err) => {
          if (files) {
            resolve(files);
          } else {
            reject(error);
          }
          // console.log('Error from resizing files', err);
        });
    });

    if (files[0].mimetype === 'image/jpeg') {
      // x_medium - 450 * 300
      const mediumImage = await new Promise((resolve, reject) => {
        sharp(files[0].path)
          .rotate()
          .resize(450, null)
          .extend({
            top: 8,
            bottom: 8,
            left: 8,
            right: 8,
            background: '#FFFFFF',
          })
          .jpeg({ quality: 50 })
          // .crop(sharp.strategy.entropy)
          .toFile(`${fileuploadDir}x_medium_${files[0].filename}`, (err) => {
            if (files) {
              resolve(files);
            } else {
              reject(error);
            }
            // console.log('Error from resizing files', err);
          });
      });

      // x_large - 900 * 650
      const largeImage = await new Promise((resolve, reject) => {
        sharp(files[0].path)
          .rotate()
          .resize(900, null)
          .extend({
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            background: '#FFFFFF',
          })
          .jpeg({ quality: 50 })
          // .crop(sharp.strategy.entropy)
          .toFile(`${fileuploadDir}x_large_${files[0].filename}`, (err) => {
            if (files) {
              resolve(files);
            } else {
              reject(error);
            }
            // console.log('Error from resizing files', err);
          });
      });

      // xx_large - 1280 * 960
      const largeImageSize = await new Promise((resolve, reject) => {
        sharp(files[0].path)
          .rotate()
          .resize(1280, null)
          .extend({
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            background: '#FFFFFF',
          })
          .jpeg({ quality: 50 })
          // .crop(sharp.strategy.entropy)
          .toFile(`${fileuploadDir}xx_large_${files[0].filename}`, (err) => {
            if (files) {
              resolve(files);
            } else {
              reject(error);
            }
            // console.log('Error from resizing files', err);
          });
      });

      // placeholder - 60 * 37
      const placeholderImage = await new Promise((resolve, reject) => {
        sharp(files[0].path)
          .rotate()
          .resize(60, null)
          .extend({
            top: 2,
            bottom: 2,
            left: 2,
            right: 2,
            background: '#FFFFFF',
          })
          // .crop(sharp.strategy.entropy)
          .toFile(`${fileuploadDir}placeholder_${files[0].filename}`, (err) => {
            if (files) {
              resolve(files);
            } else {
              reject(error);
            }
            // console.log('Error from resizing files placeholder', err);
          });
      });
    } else if (files[0].mimetype === 'image/png') {
      // x_medium - 450 * 300
      const mediumImage = await new Promise((resolve, reject) => {
        sharp(files[0].path)
          .rotate()
          .resize(450, null)
          .extend({
            top: 8,
            bottom: 8,
            left: 8,
            right: 8,
            background: '#FFFFFF',
          })
          .png({ compressionLevel: 5, adaptiveFiltering: true, force: true })
          // .crop(sharp.strategy.entropy)
          .toFile(`${fileuploadDir}x_medium_${files[0].filename}`, (err) => {
            if (files) {
              resolve(files);
            } else {
              reject(error);
            }
            // console.log('Error from resizing files', err);
          });
      });

      // x_large - 900 * 650
      const largeImage = await new Promise((resolve, reject) => {
        sharp(files[0].path)
          .rotate()
          .resize(900, null)
          .extend({
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            background: '#FFFFFF',
          })
          .png({ compressionLevel: 5, adaptiveFiltering: true, force: true })
          // .crop(sharp.strategy.entropy)
          .toFile(`${fileuploadDir}x_large_${files[0].filename}`, (err) => {
            if (files) {
              resolve(files);
            } else {
              reject(error);
            }
            // console.log('Error from resizing files', err);
          });
      });

      // xx_large - 1280 * 960
      const largeImageSize = await new Promise((resolve, reject) => {
        sharp(files[0].path)
          .rotate()
          .resize(1280, null)
          .extend({
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            background: '#FFFFFF',
          })
          .png({ compressionLevel: 5, adaptiveFiltering: true, force: true })
          // .crop(sharp.strategy.entropy)
          .toFile(`${fileuploadDir}xx_large_${files[0].filename}`, (err) => {
            if (files) {
              resolve(files);
            } else {
              reject(error);
            }
            // console.log('Error from resizing files', err);
          });
      });

      // placeholder - 48 * auto
      const placeholderImage = await new Promise((resolve, reject) => {
        sharp(files[0].path)
          .rotate()
          .resize(48, null)
          .extend({
            top: 2,
            bottom: 2,
            left: 2,
            right: 2,
            background: '#FFFFFF',
          })
          // .crop(sharp.strategy.entropy)
          .toFile(`${fileuploadDir}placeholder_${files[0].filename}`, (err) => {
            if (files) {
              resolve(files);
            } else {
              reject(error);
            }
            // console.log('Error from resizing files placeholder', err);
          });
      });
    }
    res.send({ status: 'SuccessFully uploaded!', files });
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/deletePhotos', (req, res, next) => {
    if (!req.user) {
      res.send(403);
    } else {
      next();
    }
  }, async (req, res) => {
    const filePath = fileuploadDir;
    const fileName = req.body.fileName;
    await removeFiles(fileName, filePath);
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
    const filePath = fileuploadDir;
    if (files != undefined && files.length > 0) {
      files.map(async (item) => {
        await removeFiles(item.name, filePath);
      });
      res.send({ status: 'SuccessFully removed!' });
    } else {
      res.send({ status: 'No files to remove' });
    }
  });


  /* app.post('/removeDir', function (req, res, next) {
    var folderName = req.body.folderName;
    var pathToRemove = 'public/' + folderName;
    if(folderName != undefined && folderName != null){
      // Remove Dir
      /*fse.remove(pathToRemove, function (err) {
        if (err) return console.error(err)

        // console.log('success!')
      }); */

  // Make Dir
  /* fse.ensureDir(pathToRemove, function (err) {
    if (err) return console.error(err)

    // console.log('success!');
  })
}
res.send({ status: 'Do you want to remove this dir?' });
}); */
};

export default fileUpload;
