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
   doc_type:   String,
   doc_num:    Number,
   doc_image:  String,
   address:    String,
   country:    String,
   city:       String,
   State:      String,
   post_code:  Number,
   util_image: String
});

module.exports = mongoose.model("Merchant", MerchantSchema);