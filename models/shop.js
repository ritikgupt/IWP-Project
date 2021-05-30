const mongoose = require('mongoose');
const Shop = new mongoose.model('Shop',{
  title: {type:String,required:true},
  image: {type:String,required:true},
  body: {type:String,required:true},
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }
});
module.exports = Shop;

