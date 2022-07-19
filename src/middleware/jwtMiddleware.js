const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    //encode <=>decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
      message: decoded.message,
      email: decoded.email,
      phonenumber: decoded.phonenumber,
    };

    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp - now < 60 * 60 * 24 * 2) {
      const user = await User.findById(decoded._id);
      const token = user.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }

    return next();
  } catch (error) {
    return next();
  }
};

module.exports = jwtMiddleware;
