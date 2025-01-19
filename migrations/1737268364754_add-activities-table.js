/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {

    pgm.createType( 'action', ['add', 'delete'] );
    pgm.createFunction('timestamp_z', [], {
        returns: 'timestamp',
        replace: true,
        language: 'sql'
    },
    `select CURRENT_TIMESTAMP at time zone 'utc';
    `
    );

    pgm.createTable('activities',{
        id: {type: 'varchar(16)', primaryKey: true,},
        playlistId: {type: 'varchar(16)', notNull: true},
        songId: {type: 'varchar(16)', notNull: true},
        userId: {type: 'varchar(16)', notNull: true},
        action: {type: 'action', notNull: true},
        time:  {type: 'timestamp', default: pgm.func('timestamp_z()'), notNull: true}
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropType('action');
    pgm.dropFunction('timestamp_z');
    pgm.dropTable('activities');
};
