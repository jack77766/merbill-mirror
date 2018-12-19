var express     = require('express');
var router      = express.Router();
var multer      = require('multer');
var cloudinary  = require('cloudinary');


var Merchant = require('../models/merchant.js');
var Business = require('../models/business.js');



//CLOUDINARY CONFIG
cloudinary.config({ 
  cloud_name: 'shimmyshimmycocobop', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//MULTER CONFIG
var storage = multer.diskStorage({
   filename: function(req, file, callback) {
      // console.log("Filename: " + file.originalname  );
      callback(null, file.originalname);
   }
});
var upload = multer({ storage: storage })

//MERCHANT PAGE
router.get('/merchant', function(req, res) {
   res.render('merchant_personal_app');
});

//MERCHANT PERSONAL APP
var fieldsUpload = upload.fields([{ name: 'doc_image', maxCount: 1 }, { name: 'util_image', maxCount: 1 }]);
router.post('/merchant_personal_app',fieldsUpload,  function(req, res, next) {
   var user = {
      id:       req.user.id, 
      username: req.user.username
   };

   //UPLOAD DOCUMENT IMAGE TO CLOUDINARY
   cloudinary.v2.uploader.upload(req.files['doc_image'][0].path, function(error, upload1_result) {
      // console.log(upload1_result, error);
      var doc_image_url = upload1_result.secure_url;
   
      //UPLOAD UTILITY BILL IMAGE TO CLOUDINARY
      cloudinary.v2.uploader.upload(req.files['util_image'][0].path, function(error, upload2_result) {
         // console.log(upload2_result, error);
         var util_image_url = upload2_result.secure_url;

         
            //CREATE MERCHANT OBJECT
            var newMerchant = {user:      user, 
                              first_name: req.body.first_name,
                              last_name:  req.body.last_name,
                              email:      req.body.email, 
                              phone:      req.body.phone, 
                              doc_type:   req.body.doc_type,
                              doc_num:    req.body.doc_num, 
                              doc_image:  doc_image_url,  
                              address:    req.body.address, 
                              country:    req.body.country, 
                              city:       req.body.city, 
                              state:      req.body.state, 
                              post_code:  req.body.post_code,
                              util_image: util_image_url
                           }
            //INSERT MERCHANT OBJECT INTO DB
            Merchant.create(newMerchant, function(err, createdMerchant) {
               if(err) {
                  console.log(err);
                  res.send("Error creating Merchant");
               }
               else {
                  console.log(createdMerchant);
                  res.render('merchant_business_app', {merchant: createdMerchant});
               }
            });
      });   
   });
});


//BUSINESS APP POST
router.post('/merchant_business_app', upload.array('images' , 10),  async function(req, res, next) {

   var user = {
      id:       req.user.id, 
      username: req.user.username
   }
   //UPLOAD IMAGES TO CLOUDINARY AND STORE URL IN imageArray
   var imageArray = [];
   for(var i = 0; i < req.files.length; i++) {
      console.log("file path: " + req.files[i].path);
      await cloudinary.v2.uploader.upload(req.files[i].path, function(error, result) {
         console.log("url " + i + ": " + result.secure_url);
         imageArray.push(result.secure_url);
      });
   }

   //CREATE BUSINESS OBJECT
   var newBusiness = {
                     user: user, 
                     name: req.body.name, 
                     address: req.body.address, 
                     country: req.body.country, 
                     city: req.body.city,
                     state: req.body.state, 
                     post_code: req.body.post_code, 
                     registration_number: req.body.registration_number,
                     web_page: req.body.web_page, 
                     phone: req.body.phone,
                     images: imageArray
   }
   
   Business.create(newBusiness, function(err, createdBusiness) {
      if(err) {
         console.log(err);
         res.send("Error creating Business");
      }
      else {
         console.log(createdBusiness);
         res.send("Business App Submited");
         //res.render('merchant_business_app', {merchant: createdMerchant});
      }
   });
});


function isLoggedIn(req, res, next) {
   if(req.isAuthenticated()) {
      return next();
   }
   else {
      res.redirect('/');
   }
};

// function uploadToCloudinary(image) {
//    cloudinary.v2.uploader.upload(image, function(error, result) {
//       if(error) {
//          console.log(error);
//       }
//       else {
//          console.log("Succesfully uploaded image to cloudinary!")
//          return result.secure_url;
//       }
//    });
// }

module.exports = router;