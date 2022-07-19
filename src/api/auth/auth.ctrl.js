const Joi = require('joi');
const { removeHTML } = require('../../lib/util');
const User = require('../../models/user');

//회원가입
exports.register = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(12).required(),
    password: Joi.string().required(),
    email: Joi.string(),
    phonenumber: Joi.number(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    username,
    password,
    message,
    email = '',
    phonenumber = '',
  } = ctx.request.body;

  try {
    //username check
    const exitsts = await User.findByUsername(username);
    if (exitsts) {
      ctx.status = 409; //conflict 중복
      return;
    }

    const user = new User({
      username,
      email,
      phonenumber,
    });

    await user.setPassword(password);
    await user.setMessage(message);
    await user.setEmail(email);
    await user.setPhonenumber(phonenumber);
    await user.save();

    ctx.body = user.serialize();
    const token = user.generateToken();
    console.log(user);

    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};

//로그인
exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    const validPwd = await user.checkPassword(password);
    if (!validPwd) {
      ctx.status = 401;
      return;
    }

    ctx.body = user.serialize();

    // ctx.body = user;

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};

//
exports.check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }

  ctx.body = user;
};

exports.logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};

//updateUser
exports.updateUser = async (ctx) => {
  const { id } = ctx.params;
  console.log(ctx.request.body);
  const schema = Joi.object().keys({
    message: Joi.string(),
    email: Joi.string(),
    phonenumber: Joi.number(),
  });

  console.log(id);
  console.log(ctx.request.body);

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const nextData = { ...ctx.request.body };

  if (nextData.body) {
    nextData.body = removeHTML(nextData.body);
  }

  try {
    const user = await User.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    console.log(user);
    if (!user) {
      ctx.status = 404;
      return;
    }

    ctx.body = user;
  } catch (error) {
    ctx.throw(500, error);
  }
};
