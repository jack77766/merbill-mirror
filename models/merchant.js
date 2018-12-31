var mongoose = require('mongoose');

var MerchantSchema = new mongoose.Schema({
   user: {
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   },
   first_name: String,
   last_name:  String,
   email:      String,
   phone:      Number,
   //Document info
   doc_type:   String,
   doc_num:    Number,
   doc_image:  String,
   //address
   address:    String,
   country:    String,
   city:       String,
   State:      String,
   post_code:  Number,
   //image
   util_image: String,
   //FEES
   deposit_fee: Number,
   withdrawal_fee: Number,
   percentage: Number,
   bank_accounts: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Bank_Account'
   }]
});

module.exports = mongoose.model("Merchant", MerchantSchema);