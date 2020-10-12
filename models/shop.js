const c = require('mongoose');
const ShopSchema = new c.Schema({
  title: String,
  image: String,
  body: String,
  id: String,
  user:{
    type:c.Schema.ObjectId,
    ref:'User'
  }
});
module.exports = c.model('Shop', ShopSchema);

