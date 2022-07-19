const Router = require('koa-router');
const userCtrl = require('./user.ctrl');

const user = new Router();

user.post('/info/:id', userCtrl.info);
user.patch('/update/:id', userCtrl.update);

module.exports = user;
