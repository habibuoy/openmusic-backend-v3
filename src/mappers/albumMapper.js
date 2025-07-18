/* eslint-disable camelcase */

const albumMapper = {
  fromDb: ({
    id, name, year, cover_url, songs,
  }) => ({
    id,
    name,
    year,
    coverUrl: cover_url,
    songs,
  }),
};

module.exports = { albumMapper };
