const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  PostSongPayloadSchema,
  DeleteSongPayloadSchema,
};
