import { Context } from 'koa';
import BaseJoi from 'joi';
import JoiPhoneNumberExtension from '@tepez/joi-phone-number-extensions';

const Joi = BaseJoi.extend(JoiPhoneNumberExtension);

export function validateParams(params: any, schema: string, ctx: Context): boolean {
  const result = Joi.validate(params, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      error: String(result.error),
    };
    return false;
  } else {
    return true;
  }
}

export function validateBody(schema: string, ctx: Context): boolean {
  return validateParams(ctx.request.body, schema, ctx);
}

export function validateQuery(schema: string, ctx: Context): boolean {
  return validateParams(ctx.query, schema, ctx);
}
