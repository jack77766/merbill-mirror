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
   address: String,
   country: String,
   city: String,
   state: String,
   post_code: Number,
   registration_number: Number,
   web_page: String,
   phone: Number,
   images: [{
      type: String
  }]
});



module.exports = mongoose.model("Business", BusinessSchema);