var mongoose = require('mongoose');

var BankSchema = new mongoose.Schema({

name: String,
address: String

});

module.exports = mongoose.model("Bank", BankSchema);