var mongoose = require('mongoose');


var BusinessSchema = new mongoose.Schema({
   user: {
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   },
   name: String,
   //address
   address: String,
   country: String,
   city: String,
   state: String,
   post_code: Number,
   //business details
   registration_number: Number,
   website: String,
   phone: Number,
   images: [{
      type: String
  }]
});



module.exports = mongoose.model("Business", BusinessSchema);