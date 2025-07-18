/* eslint-disable camelcase */

const playlistMapper = {
  activitiesFromDb: ({
    playlist_id,
    activities,
  }) => ({
    playlistId: playlist_id,
    activities,
  }),
};

module.exports = { playlistMapper };
