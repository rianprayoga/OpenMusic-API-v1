/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('collaborations', {
        id: {type: 'varchar(16)', primaryKey: true, notNull: true },
        playlistId: {type: 'varchar(16)', notNull: true },
        userId:{type: 'varchar(16)', notNull: true }
    });

    pgm.createIndex('collaborations',['playlistId','userId',],{
        'name': 'unique_composite_playlistid_userId',
        'unique': true
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('collaborations');
};
