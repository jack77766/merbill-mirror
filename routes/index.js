var express     = require('express');
var router      = express.Router();
var passport    = require('passport');

var Merchant    = require('../models/merchant.js');
var User        = require('../models/user.js');
var Business    = require('../models/business.js');

var middleware  = require('../middleware')
var myFunctions = require('../modules.js')

//INDEX PAGE
router.get('/', function(req, res) {
   res.render('index');
});

//ADMIN PAGE
router.get('/admin', function(req, res) {
   Merchant.find({}, function(err, merchants) {
      if(err) console.log(err);
      else {
         res.render('admin', {merchants: merchants});
      }
   })
});

//ADMIN MERCHANT
router.get('/admin/:id', function(req, res) {
   Merchant.findById(req.params.id, function(err, foundMerchant) {
      var id = foundMerchant.user.id;
      Business.findOne({'user.id': id}, function(err, foundBusiness) {
         if(foundMerchant.doc_image) {
            var doc_image  = myFunctions.pdfThumbnail(foundMerchant.doc_image);
         }
         if(foundMerchant.util_image)  {
            var util_image = myFunctions.pdfThumbnail(foundMerchant.util_image);
         }
         if(foundBusiness.images) {
            var images = foundBusiness.images;
            var newImages = [];
            images.forEach(function(image) {
               newImages.push(myFunctions.pdfThumbnail(image))
            });
         }

         res.render('admin_merchant', {merchant: foundMerchant, business: foundBusiness, 
                                       doc_image: doc_image, util_image: util_image, business_images:newImages })
      });
   });
});


//LOGIN PAGE
router.get('/login', function(req,res) {
   res.render('login');
});
//LOGIN 
router.post('/login', passport.authenticate('local', {
         successRedirect: '/merchant',
         failureRedirect: 'login',
      }), function(req, res) {
});
//LOGOUT
router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

//REGISTER PAGE
router.get('/register', function(req,res) {
   res.render('register');
});
//REGISTER 
router.post('/register', function(req, res) {
   var newUser = new User({
      username:  req.body.username,
      email:     req.body.email
   });
   var password = req.body.password;
   User.register(newUser, password, function(err, user) {
      if(err){
         return res.redirect('/register');
     } else {
         passport.authenticate('local')(req, res, function(){
            res.redirect('/merchant');
         });
      }
   })
});




module.exports = router;