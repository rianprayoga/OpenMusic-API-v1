
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('albums', {
        id: {type: 'varchar(16)', primaryKey: true, notNull: true },
        name: { type: 'varchar(100)', notNull: true },
        year: { type: 'integer', notNull: true },
      });

      pgm.createTable('songs', {
        id: {type: 'varchar(16)', primaryKey: true, notNull: true },
        title: { type: 'varchar(100)', notNull: true },
        year: { type: 'integer', notNull: true },
        genre: { type: 'varchar(100)', notNull: true },
        performer: { type: 'varchar(100)', notNull: true },
        duration: { type: 'integer', notNull: false },
        albumid: { type: 'varchar(16)', notNull: false, references: '"albums"',onDelete: 'cascade' },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('songs');
    pgm.dropTable('albums');
};
