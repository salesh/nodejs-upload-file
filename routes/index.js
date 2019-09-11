const express = require('express');
const router = express.Router();
const multer = require('multer');
const request = require('request');
const { 
  uploadName, 
  uploadIP, 
  uploadPORT, 
  uploadPassword, 
  uploadServer, 
  mode,
  uploadApiLogin,
  uploadApiStore,
  objectName
} = require('../config');

const fs = require('fs')

const storageDisk = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const uploadDisk = multer({storage: storageDisk})

const storageMemory = multer.memoryStorage()
const uploadMemory = multer({storage: storageMemory})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST upload file */
router.post('/uploadFile', uploadDisk.single('myFile'), function(req, res, next) {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

router.post('/uploadBigFile', uploadMemory.single('myFile'), (req, res, next) => {
  request.post({
    url: `http://${uploadIP}:${uploadPORT}/${uploadApiLogin}`,
    headers: {
      "Content-Type": "application/json"
    },
    json: {
      "name": `${uploadName}`,
      "password": `${uploadPassword}`,
      "server": `${uploadServer}`,
      "mode": `${mode}`
    }
  }, (err, response, body) => {
    if (err) {
      console.log(err);
    } else {
      // TODO: Check whats wrong with this API call;
      const xsrfToken = response.headers['xsrf-token'];
      const authToken = response.headers['set-cookie'];
      const formData = {
        "properties": '[{"name":"DocumentId","value":"199"}, {"name":"DocumentName","value":"Front-end Developer Handbook 2019.pdf"}]',
        "parts": req.file.buffer,
        "name": `${objectName}`
      }
      request.post({
        url: `http://${uploadIP}:${uploadPORT}/${uploadApiStore}/${objectName}`,
        headers: {
          "X-XSRF-TOKEN": xsrfToken,
          "Cookie": authToken
        },
        formData: formData
      }, (err, response, body) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      });
    }
  });
});

router.post('/testRoute', uploadDisk.single('myFile'), (req, res, next) => {
  console.log(req.file.path);

  request.post({
    url: `http://${uploadIP}:${uploadPORT}/${uploadApiLogin}`,
    headers: {
      "Content-Type": "application/json"
    },
    json: {
      "name": `${uploadName}`,
      "password": `${uploadPassword}`,
      "server": `${uploadServer}`,
      "mode": `${mode}`
    }
  }, (err, response, body) => {
    if (err) {
      console.log(err);
    } else {
      // TODO: Check whats wrong with this API call;
      const readStream = fs.createReadStream(req.file.path);
      readStream.on('data', function(chunk){ })
 
      // readable event
      readStream.on('readable', function () {
          console.log('ready to read');
          this.read();
      });      

      const xsrfToken = response.headers['xsrf-token'];
      const authToken = response.headers['set-cookie'];
      const reqOptions =  {
        method: 'POST',
        url: `http://${uploadIP}:${uploadPORT}/${uploadApiStore}/${objectName}`,
        formData: {
          properties: '',
          parts: readStream,
          name: `${objectName}`
        },
        headers: {
          "Content-Type": "multipart/form-data",
          "X-XSRF-TOKEN": xsrfToken,
          "Cookie": authToken
        },
      };
      request(reqOptions, (err, response, body) => {
        console.log(response.body);
      });
    }
  });
});

router.delete('/deleteFile', (req, res, next) => {
  const path = './uploads/myFile-1567639673654'
  
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      return
    }
  
    //file removed
  })
});

module.exports = router;
