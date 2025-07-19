const PrefixSymbol = ':';

const AlbumLikesCachePrefix = `albumLikes${PrefixSymbol}`;
const AlbumCachePrefix = `albums${PrefixSymbol}`;

const PlaylistCachePrefix = `playlists${PrefixSymbol}`;
const PlaylistSongsCachePrefix = `playlistSongs${PrefixSymbol}`;
const PlaylistActivitiesCachePrefix = `playlistActivities${PrefixSymbol}`;

module.exports = {
  AlbumLikesCachePrefix,
  AlbumCachePrefix,
  PlaylistCachePrefix,
  PlaylistSongsCachePrefix,
  PlaylistActivitiesCachePrefix,
};
