var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({

first_name: String,
last_name: String,
brand: String,
bank_account: {
   id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bank_Account'
   },
   account_holder: String
},
amount: Number

});

module.exports = mongoose.model("Payment", PaymentSchema);