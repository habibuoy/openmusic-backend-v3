const Joi = require('joi');

const ExportPlaylistSchema = Joi.object({
  targetEmail: Joi.string().required(),
});

module.exports = { ExportPlaylistSchema };
