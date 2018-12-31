var express     = require('express');
var router      = express.Router();

var Merchant    = require('../models/merchant.js');
var User        = require('../models/user.js');
var Business    = require('../models/business.js');
var Bank_Account= require('../models/bank_account.js');

var myFunctions = require('../modules.js')

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
      if(foundMerchant.doc_image) {
         var doc_image  = myFunctions.pdfThumbnail(foundMerchant.doc_image);
      }
      if(foundMerchant.util_image)  {
         var util_image = myFunctions.pdfThumbnail(foundMerchant.util_image);
      }
      Business.findOne({'user.id': id}, function(err, foundBusiness) {
         if(!err && foundBusiness) { 
            if(foundBusiness.images) {
               var images = foundBusiness.images;
               var newImages = [];
               images.forEach(function(image) {
                  newImages.push(myFunctions.pdfThumbnail(image))
               });
            }
         }
         res.render('admin_merchant', {merchant: foundMerchant, business: foundBusiness, 
                                       doc_image: doc_image, util_image: util_image, business_images:newImages })
      });
   });
});

//MERCHANT FEES
router.get('/admin/:id/fees', function(req, res) {
   Merchant.findById(req.params.id, function(err, foundMerchant){
      if(err) {
         console.log(err);
         res.redirect('back');
      }
      else{
         res.render('admin/fees', {merchant: foundMerchant})
      }
   });
});

//MERCHANT SET FEES VIEW
router.get('/admin/:id/fees/set', function(req, res) {
   Merchant.findById(req.params.id, function(err, foundMerchant){
      if(err) {
         console.log(err);
         res.redirect('back');
      }
      else{
         res.render('admin/fees_set', {merchant: foundMerchant})
      }
   });
});

//MERCHANT FEES POST
router.post('/admin/:id/fees', function(req, res) {
   Merchant.findByIdAndUpdate(req.params.id, {
                           deposit_fee: req.body.deposit_fee,
                           withdrawal_fee: req.body.withdrawal_fee,
                           percentage: req.body.percentage
                           }, function(err, updatedMerchant) {
      if(err) {
         console.log(err);
      }
      else {
         res.redirect('/admin/'+req.params.id+'/fees');
      }
   });
});

//MERCHANT BANK ACCOUNTS VIEW
router.get('/admin/:id/bank_accounts', function(req,res) {
   Merchant.findById(req.params.id, async function(err, foundMerchant) {
      if(err) { console.log(err); }
      else {
         let bankAccounts = await getBankAccounts(foundMerchant);      
         res.render('admin/bank_accounts', 
                  {merchant: foundMerchant, bank_accounts: bankAccounts});
      }
   });
});

//RETURN ALL BANK ACCOUNTS ASSOCIATED TO THE MERCHANT AS OBJECTS
async function getBankAccounts(merchant) {
   var bankAccounts = [];
      if(merchant.bank_accounts.length > 0) {
         for(account of merchant.bank_accounts) {
            try {
            let foundAccount = await Bank_Account.findById(account);
            bankAccounts.push(foundAccount);  
            }
            catch(err) {console.log(err)}
         }
      }
   // console.log(bankAccounts);
   return bankAccounts;
}

//MERCHANT BANK ACCOUNT NEW 
router.get('/admin/:id/bank_accounts/new', function(req, res) {
   Merchant.findById(req.params.id, function(err, foundMerchant) {
      if(err) {
         console.log(err);
      }
      else {
         res.render('admin/bank_accounts_new', {merchant: foundMerchant})
      }
   });
});

//MERCHANT BANK ACCOUNT NEW POST
router.post('/admin/:id/bank_accounts', function(req, res) {

   var newAccount = {
      account_holder: req.body.account_holder,
      IBAN: req.body.IBAN,
      swift: req.body.swift,
      address: req.body.address,
      country: req.body.country,
      city: req.body.city,
      state: req.body.state,
      post_code: req.body.post_code      
   }

   Bank_Account.create(newAccount, function(err, createdAccount) {
      if(err) {
         console.log(err);
      }
      else {
         Merchant.findById(req.params.id, function(err, foundMerchant) {
            if(err) {
               console.log(err);
            }
            else{
               var accounts = foundMerchant.bank_accounts;
               accounts.push(createdAccount.id);
               Merchant.findByIdAndUpdate(req.params.id, {bank_accounts: accounts}, function(err) {
                  if(err) {
                     console.log(err);
                  }
                  else {
                     
                  }
               })
            }
         })
         res.redirect('/admin/'+req.params.id+'/bank_accounts');
      }
   });
   
});



module.exports = router;