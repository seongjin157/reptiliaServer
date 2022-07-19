const Comment = require('../../models/comment');

exports.write = async (ctx) => {
  const { postId, userId, comment, username } = ctx.request.body;

  if (comment === '') {
    return;
  }

  const newComment = new Comment({
    postId,
    userId,
    comment,
    username,
  });

  await newComment.save();
  ctx.body = newComment;
};

exports.read = async (ctx) => {
  const postId = ctx.request.body;

  const comment = await Comment.find(postId).exec();

  ctx.body = comment;
};

exports.delete = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Comment.findByIdAndRemove(id).exec();
    ctx.status = 204;
    ctx.body = Comment;
  } catch (error) {
    ctx.throw(500, error);
  }
};
