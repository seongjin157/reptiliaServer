const Router = require('koa-router');
const commentCtrl = require('./comments.ctrl');

const comments = new Router();

comments.post('/write', commentCtrl.write);
comments.get('/read', commentCtrl.read);
comments.delete('/delete/:id', commentCtrl.delete);

module.exports = comments;
