var mongoose = require('mongoose');

var BankAccountSchema = new mongoose.Schema({

   //BANK
   bank:  {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Bank_Account'
      },
      name: String},
   //ACCOUNT
   account_holder: String,
   IBAN: Number,
   swift: Number,
      //account address
   address: String,
   city: String,
   state: String,
   post_code: Number,
   country: String,
   

});

module.exports = mongoose.model("Bank_Account", BankAccountSchema);