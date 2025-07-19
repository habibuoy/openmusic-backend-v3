/* eslint-disable camelcase */

const playlistMapper = {
  activitiesFromDb: ({
    playlist_id,
    activities,
  }) => ({
    playlistId: playlist_id,
    activities,
  }),
  playlistIdsFromDb: ({
    playlist_id,
  }) => ({
    id: playlist_id,
  }),
};

module.exports = { playlistMapper };
