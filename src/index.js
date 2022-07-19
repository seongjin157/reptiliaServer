require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const api = require('./api');
const koaBodyparser = require('koa-bodyparser');
const mongoose = require('mongoose');

const { createFakeData } = require('./createFakedata');
const jwtMiddleware = require('./middleware/jwtMiddleware');
const path = require('path');
const serve = require('koa-static');
const send = require('koa-send');

const { PORT, MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI, { useNewURLParser: true })
  .then(() => {
    console.log('DB접속완료');
    //createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(koaBodyparser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

// const dir = path.resolve(__dirname, '../albatross/build');

// app.use(serve(dir));

// app.use(async (ctx) => {
//   if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
//     await send(ctx, 'index.html', { root: dir });
//   }
// });

const port = PORT;
app.listen(port, () => {
  console.log(`${port}서버로 준비되었습니다`);
});
