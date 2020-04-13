const express = require('express');
const router = express.Router();
const multer = require('multer');
const request = require('request');
const Joi = require('@hapi/joi');

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
      const authCodeParam = response.headers['xsrf-token'];
      const cookiesParam = response.headers['set-cookie'];
      const arrayPropertiesFile = [
        { name: 'DocumentId', value: guid() },
        { name: 'DocName', value: req.file.originalname }
      ];
      const fileData = {
        properties: JSON.stringify(arrayPropertiesFile),
        name: objectName,
        parts: req.file.buffer,
      }
      return new Promise(function (resolve, reject) {
        request.post({
          url: `http://${uploadIP}:${uploadPORT}/${uploadApiStore}/${objectName}`,
          headers: {
            "X-XSRF-TOKEN": authCodeParam,
            "Cookie": cookiesParam
          },
          formData: fileData
        }, (err, response, body) => {
          if (err) {
            console.log(err);
          } else {
            console.log(response);
          }
        });
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

function guid () {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}


router.post('/testing-joi', async (req, res, next) => {
  const arrayOfDepartments = req.body.departments;
  const rules = Joi.array().items(
    Joi.object({
      id: Joi.number().required().messages({
        'any.required': `Department id is a required field`
      }),
      name: Joi.string().required().messages({
        'any.required': `Department name is a required field`
      })
    })
  );
  const { error } = rules.validate(arrayOfDepartments);
  console.log(error);
  res.send(error);
});

module.exports = router;
