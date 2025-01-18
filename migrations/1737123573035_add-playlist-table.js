/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {

    pgm.createTable('users', {
        id: { type: 'varchar(16)', primaryKey: true,},
        username: {type: 'varchar(20)',unique: true,notNull: true},
        password: {type: 'TEXT', notNull: true,},
        fullname: {type: 'varchar(20)',notNull: true,},
      });

    pgm.createTable('playlist',{
        id: {type: 'varchar(16)', primaryKey: true, notNull: true },
        name: { type: 'varchar(20)', notNull: true },
        owner: {type: 'varchar(16)', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    });

    pgm.createTable('playlist_songs',{
        playlistId : {type: 'varchar(16)', primaryKey: true, notNull: true, references: '"playlist"', onDelete: 'CASCADE'},
        songId : {type: 'varchar(16)', primaryKey: true, notNull: true, references: '"songs"', onDelete: 'CASCADE'},
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist_songs');
    pgm.dropTable('playlist');
    pgm.dropTable('users');
};
