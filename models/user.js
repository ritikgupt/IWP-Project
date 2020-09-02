const c = require('mongoose');
const h = require('passport-local-mongoose');
const UserSchema = new c.Schema({
  username: String,
  password: String,
  email: String,
  mobile: String,
  address: String,
});
UserSchema.plugin(h);
module.exports = c.model('User', UserSchema);
