import Router from 'koa-router';
import moment from 'moment';
import BaseJoi from 'joi';
import JoiPhoneNumberExtension from '@tepez/joi-phone-number-extensions';

import { getCollection } from './db';
import { validateBody, validateQuery } from './utils';

const Joi = BaseJoi.extend(JoiPhoneNumberExtension);

const VALID_LEAD_TYPES = ['a', 'b', 'c', 'd'];
const VALID_PROPERTY_TYPES = ['HOUSE', 'FLAT', 'COMMERCIAL_OBJECT', 'OTHER'];

export const apiRouter = new Router({ prefix: '/api' });

const postLeadBodySchema = Joi.object().keys({
  type: Joi.string().valid(...VALID_LEAD_TYPES).required(),
  district: Joi.string().required(),
  propertyType: Joi.string().valid(...VALID_PROPERTY_TYPES).required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.phoneNumber().required(),
});

const getLeadsQuerySchema = Joi.object().keys({
  type: Joi.string().valid(...VALID_LEAD_TYPES),
  createdAt: Joi.date().iso(),
});

apiRouter.post('/leads', async (ctx) => {
  if (!validateBody(postLeadBodySchema, ctx)) {
    return;
  }

  const {
    type,
    district,
    propertyType,
    fullName,
    email,
    phoneNumber,
  } = ctx.request.body;

  const leadsCollection = await getCollection('leads');
  await leadsCollection.insertOne({
    type,
    district,
    propertyType,
    fullName,
    email,
    phoneNumber,
    createdAt: new Date(),
  });

  ctx.status = 200;
});

const getLeadsDbQuery = ({ type, createdAt }: any) => {
  const query: any = {};
  if (type) {
    query.type = type;
  }
  if (createdAt) {
    query.createdAt = {
      $gt: moment(createdAt).toDate(),
    };
  }
  return query;
};

apiRouter.get('/leads', async (ctx) => {
  if (!validateQuery(getLeadsQuerySchema, ctx)) {
    return;
  }

  const leadsCollection = await getCollection('leads');
  const leads = await leadsCollection
    .find(getLeadsDbQuery(ctx.query))
    .toArray();
  ctx.body = leads;
});
