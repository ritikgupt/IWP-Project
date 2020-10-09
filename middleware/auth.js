const jwt = require('jsonwebtoken');
const JwtAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, "apna_bazaar");
    req.userData = decode;
    next();
  } catch (e){
    console.log(e)
    res.redirect('/login');
  }
};

module.exports = JwtAuth;