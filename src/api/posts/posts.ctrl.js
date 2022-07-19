const Post = require('../../models/post');
const mongoose = require('mongoose');
const Joi = require('joi');
const { removeHTML } = require('../../lib/util');
const { validateInput } = require('../../lib/validations');

exports.readAllPosts = async (ctx) => {
  const page = parseInt(ctx.query.page || '1', 10); //맨뒤에  10은 10진법으로 표시하라는의미
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount = await Post.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));

    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 150
          ? post.body
          : `${post.body.slice(0, 150)}...more`,
    }));
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.writePost = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  });

  validateInput(schema, ctx);

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body: removeHTML(body),
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.readPost = async (ctx) => {
  ctx.body = ctx.state.post;
};

exports.deletePost = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.updatePost = async (ctx) => {
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  });

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
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};
