const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({storage: storage})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST upload file */
router.post('/uploadFile', upload.single('myFile'), function(req, res, next) {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload file');
    error.httpStatusCode = 400;
    return next(error);
  }
  console.log(__dirname);
  console.log(file);
  res.send(file);
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
