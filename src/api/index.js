const Router = require('koa-router');
const posts = require('./posts');
const auth = require('./auth');
const user = require('./user');
const comments = require('./comments');

const api = new Router();

api.use('/user', user.routes());

api.use('/posts', posts.routes());

api.use('/auth', auth.routes());

api.use('/comment', comments.routes());

module.exports = api;
