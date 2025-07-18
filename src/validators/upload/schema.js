const Joi = require('joi');

const AlbumImageHeaderSchema = Joi.object({
  'content-type': Joi.string().pattern(/^image\//).required(),
}).unknown();

module.exports = { AlbumImageHeaderSchema };
