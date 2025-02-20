import Joi from 'joi';

export const addCommentBodySchema = Joi.object({
  comment: Joi.object({
    body: Joi.string()
      .description(
        'This field contains the text of the comment that you want to create.'
      )
      .required()
  }).required()
}).required();
