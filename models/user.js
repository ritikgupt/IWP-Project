const mongoose = require('mongoose');
const User = new mongoose.model('User',{
  username: {type:String,required:true,unique:true},
  password: {type:String,required:true},
  email: {type:String,required:true,unique:true},
  mobile: {type:String,required:true},
  address: {type:String,required:true},
});
module.exports = User;