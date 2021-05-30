const mongoose = require('mongoose');
const Profile = new mongoose.model("Profile",{
  username: {
    type:String,
    trim:true,
    maxlength:100,
    unique:true,
    required:true
  },
  address: {
    type:String,
    trim:true,
    maxlength:100,
    required:true
  },
  email: {
    type:String,
    trim:true,
    maxlength:100,
    unique:true,
    required:true
  },
  password: {
    type:String,
    trim:true,
    minlength:10,
    required:true
  },
  mobile: {
    type:String,
    trim:true,
    required:true
  },
});

module.exports = Profile
