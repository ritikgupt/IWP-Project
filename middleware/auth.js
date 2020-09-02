const jwt = require('jsonwebtoken');
const JwtAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, 'amz_automotive');
    req.userData = decode;
    next();
  } catch (e){
    res.redirect('/student/login');
  }
};

module.exports = JwtAuth;