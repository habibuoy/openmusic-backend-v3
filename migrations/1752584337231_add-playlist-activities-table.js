/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('playlist_activities', {
    id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(21)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(21)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    time: {
      type: 'datetime',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlist_activities',
    'fk_playlist_activities.playlist_id_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'playlist_activities',
    'fk_playlist_activities.song_id_songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE SET NULL',
  );

  pgm.addConstraint(
    'playlist_activities',
    'fk_playlist_activities.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL',
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('playlist_activities');
};
