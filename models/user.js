const c = require('mongoose');
const h = require('passport-local-mongoose');
const UserSchema = new c.Schema({
  username: {type:String,required:true,unique:true},
  password: {type:String,required:true},
  email: {type:String,required:true,unique:true},
  mobile: {type:String,required:true},
  address: {type:String,required:true},
});
UserSchema.plugin(h);
module.exports = c.model('User', UserSchema);
