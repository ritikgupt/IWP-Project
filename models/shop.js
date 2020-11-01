const c = require('mongoose');
const ShopSchema = new c.Schema({
  title: {type:String,required:true},
  image: {type:String,required:true},
  body: {type:String,required:true},
  id: String,
  user:{
    type:c.Schema.ObjectId,
    ref:'User'
  }
});
module.exports = c.model('Shop', ShopSchema);

