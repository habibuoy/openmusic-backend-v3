const PrefixSymbol = ':';

const AlbumLikesCachePrefix = `albumLikes${PrefixSymbol}`;

const PlaylistCachePrefix = `playlists${PrefixSymbol}`;
const PlaylistSongsCachePrefix = `playlistSongs${PrefixSymbol}`;
const PlaylistActivitiesCachePrefix = `playlistActivities${PrefixSymbol}`;

module.exports = {
  AlbumLikesCachePrefix,
  PlaylistCachePrefix,
  PlaylistSongsCachePrefix,
  PlaylistActivitiesCachePrefix,
};
