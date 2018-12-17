var express     = require('express');
var router      = express.Router();
var multer      = require('multer');
var cloudinary = require('cloudinary');


cloudinary.config({ 
  cloud_name: 'shimmyshimmycocobop', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var storage = multer.diskStorage({
   filename: function(req, file, callback) {
      // var pos = file.originalname.lastIndexOf('.');
      // var ext = file.originalname.slice(pos, file.originalname.length); 
      console.log("Filename: " + file.originalname  );
      // console.log("Filename: " + file.filename + " ext: " +ext ) 
      callback(null, file.originalname);
   }
});
var upload = multer({ storage: storage })


router.get('/upload', function(req, res) {
   res.render('upload');
});

var fieldsUpload = upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }])
router.post('/upload', fieldsUpload, function (req, res, next) {
   console.log(req.body.email);
   console.log(req.files['image1'][0].path)
   console.log(req.files['image2'][0].path)
   // console.log("FILE: " + req.filesimage);
   // for(var i = 0; i < req.files.length; i++) {
   //    console.log("file path: " + req.files[i].path);
   // }
   
   // cloudinary.v2.uploader.upload(req.file.path, function(error, result) {console.log(result, error)});

   res.send("Succesfull Upload"); 
   // + " '\n File: " + req.file.fieldname + ", "
   // + req.file.originalname + ", "
   // + req.file.encoding + ", "
   // + req.file.mimetype + ", "
   // + req.file.size + ", " 
   // + req.file.destination + ", "
   // + req.file.filename + ", "
   // + req.file.path + ", "
   // + req.file.buffer + ", ");
   // // req.file is the `avatar` file
   // // req.body will hold the text fields, if there were any
   
});

function isLoggedIn(req, res, next) {
   if(req.isAuthenticated()) {
      return next();
   }
   else {
      res.redirect('/');
   }
};

module.exports = router;