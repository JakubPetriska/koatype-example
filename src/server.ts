import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';

import { apiRouter } from './api';
import { PORT } from './config';

const app = new Koa();
app.use(koaBodyParser({
  enableTypes: ['json'],
}));

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.listen(PORT);

console.log(`Server running on port ${PORT}`);
