import Router from 'koa-router';
import moment from 'moment';

import { getCollection } from './db';

export const apiRouter = new Router({ prefix: '/api' });

apiRouter.post('/leads', async (ctx) => {
  const {
    type,
    district,
    propertyType,
    fullName,
    email,
    phoneNumber
  } = ctx.request.body

  const leadsCollection = await getCollection('leads')
  await leadsCollection.insertOne({
    type,
    district,
    propertyType,
    fullName,
    email,
    phoneNumber,
    createdAt: new Date()
  })

  ctx.status = 200;
})

apiRouter.get('/leads', async (ctx) => {
  const {
    type,
    createdAt
  } = ctx.query

  const query = {}
  if (type) {
    query.type = type
  }
  if (createdAt) {
    query.createdAt = {
      $gt: moment(createdAt).toDate()
    }
  }
  const leadsCollection = await getCollection('leads')
  const leads = await leadsCollection.find(query)
    .toArray()
  ctx.body = leads;
})

