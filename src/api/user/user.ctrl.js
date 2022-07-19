const Joi = require('joi');
const { removeHTML } = require('../../lib/util');
const User = require('../../models/user');

exports.info = async (ctx) => {
  const { id } = ctx.params;

  try {
    const user = await User.findById(id).exec();
    if (!user) {
      ctx.status = 401;
      return;
    }
    console.log(user);
    ctx.body = user;
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.update = async (ctx) => {
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
