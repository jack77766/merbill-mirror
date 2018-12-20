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
router.post('/upload', fieldsUpload, async function (req, res, next) {

   var upload1 = await uploadToCloudinary(req.files['image1'][0].path);
   var upload2 = await uploadToCloudinary(req.files['image2'][0].path);
   console.log("Url #1: " + upload1.secure_url);
   console.log("Url #2: " + upload2.secure_url);

   // for(var key in url1) {
   //    console.log("Cloudinary url: " + key + " : " + url1[key]);

   // }
   // console.log("Cloudinary url: " + url1);
   // var url2 = await uploadToCloudinary(req.files['image2'][0].path);
   // console.log("Cloudinary url: " + url2);


   res.send("Succesfull Upload"); 

});

function uploadToCloudinary(image) {
   return new Promise((resolve, reject) => {
     cloudinary.v2.uploader.upload(image, (err, url) => {
       if (err) return reject(err);
       resolve(url);
     })
   });
 }


// async function uploadToCloudinary(image) {
//    try{
//       let url = await cloudinary.v2.uploader.upload(image);
//       // , function(error, result) {
//       //    if(error) {
//       //       console.log(error);
//       //    }
//       //    else {
//       //       console.log("Succesfully uploaded image to cloudinary!")
//       //       //return result.secure_url;
//       //    }
//       // });
//    }
//    catch(err){ console.log(err)}
// }

function isLoggedIn(req, res, next) {
   if(req.isAuthenticated()) {
      return next();
   }
   else {
      res.redirect('/');
   }
};

module.exports = router;