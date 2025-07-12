/* eslint-disable camelcase */

const songMapper = {
  fromDb: ({
    id, title, year, genre, performer, duration, album_id,
  }) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId: album_id,
  }),
};

module.exports = { songMapper };
