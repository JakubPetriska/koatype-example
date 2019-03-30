import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';

import { PORT } from './config';
import { apiRouter } from './api';

const app = new Koa();
app.use(koaBodyParser({
  enableTypes: ['json']
}))

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.listen(PORT);

console.log(`Server running on port ${PORT}`);