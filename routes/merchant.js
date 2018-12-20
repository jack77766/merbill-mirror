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
   Merchant.findOne({'user.id': req.user.id}, function(err, foundMerchant) {
      if(!foundMerchant) {
         res.render('merchant/personal_app_new');
      }
      else {
         Business.findOne({'user.id': req.user.id}, function(err, foundBusiness) {
            if(!foundBusiness) {
               res.render('merchant/business_app_new');
            }
            else res.render('merchant/index')
         });
      }
   });
});

//MERCHANT PERSONAL APP EDIT
router.get('/merchant/personal_app_edit', function(req, res) {
   Merchant.findOne({'user.id':req.user.id}, function(err, foundMerchant) {
      if(err) console.log(err);
      else {
         res.render('merchant/personal_app_edit', {merchant: foundMerchant});
      }
   })
});


//MERCHANT PERSONAL APP NEW
var fieldsUpload = upload.fields([{ name: 'doc_image', maxCount: 1 }, { name: 'util_image', maxCount: 1 }]);
router.post('/merchant/personal_app_new', fieldsUpload,  function(req, res, next) {
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
                  // User.findByIdAndUpdate(req.user.id, )
                  res.render('merchant/business_app_new', {merchant: createdMerchant});
               }
            });
      });   
   });
});


//PERSONAL APP UPDATE
router.put('/merchant/personal_app_edit', fieldsUpload, async function(req, res) {
   var merchant = req.body.merchant;
   var doc_image_url;
   var util_image_url;
   if(req.files['doc_image'][0]) {
      //UPLOAD DOCUMENT IMAGE TO CLOUDINARY
      let upload1 = await uploadToCloudinary(req.files['doc_image'][0].path);
      doc_image_url = upload1.secure_url; 
   }
   if(req.files['util_image'][0]) {
      //UPLOAD DOCUMENT IMAGE TO CLOUDINARY
      let upload2 = await uploadToCloudinary(req.files['doc_image'][0].path);
      util_image_url = upload2.secure_url; 
   }
   merchant.doc_image  = doc_image_url;
   merchant.util_image = util_image_url;

   console.log("Merchant: " + merchant.first_name + " " + merchant.last_name);
   Merchant.findOneAndUpdate({'user.id':req.user.id}, merchant, function(err, updatedMerchant){
      if(err) console.log(err);
      else {
         res.send("Succesfully update app");
      }
   });
});


//BUSINESS APP POST
router.post('/merchant/business_app_new', upload.array('images' , 10),  async function(req, res, next) {

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
         //res.render('merchant/business_app_new', {merchant: createdMerchant});
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

function uploadToCloudinary(image) {
   return new Promise((resolve, reject) => {
     cloudinary.v2.uploader.upload(image, (err, url) => {
       if (err) return reject(err);
       resolve(url);
     })
   });
 }


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