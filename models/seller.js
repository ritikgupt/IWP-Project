const mongoose = require('mongoose');
const Seller = new mongoose.model('Seller',{
  email: {
    type:String,
    required:true,
    trim:true,
    maxlength:100,
    unique:true
  },
  mobile: {
    required:true,
    type:String,
    trim:true,
  },
  username: {
    required:true,
    type:String,
    trim:true,
    maxlength:100,
    unique:true
  },
  room: {
    required:true,
    type:String,
    trim:true,
  }
});

module.exports = Seller

