const { default: mongoose } = require('mongoose');
const Post = require('../models/post');

const { ObjectId } = mongoose.Types;

const getPostById = async (ctx, next) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400; //Bad Request.
    ctx.body = {
      message: 'ID가 object가 아님',
    };
    return;
  }

  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.state.post = post;
    return next();
  } catch (error) {
    ctx.throw(500, error);
  }

  return next();
};

module.exports = getPostById;
