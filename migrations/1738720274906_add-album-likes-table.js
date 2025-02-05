const playlist = require('../src/api/playlist');

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('userlikes', {
        userId: { type: 'varchar(16)', notNull: true, references: '"users"',onDelete: 'cascade'},
        albumId: { type: 'varchar(16)', notNull: true,references: '"albums"',onDelete: 'cascade' }
    });

    pgm.createIndex('userlikes',['userId','albumId',],{
        'name': 'unique_composite_userId_albumId',
        'unique': true
    });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('userlikes');
};
