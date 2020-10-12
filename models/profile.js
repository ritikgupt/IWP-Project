const c = require('mongoose');
const ProfileSchema = new c.Schema({
  username: String,
  address: String,
  email: String,
  password: String,
  mobile: Number,
});
module.exports = c.model('Profile', ProfileSchema);
