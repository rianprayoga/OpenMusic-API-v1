const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { getId, generatePlaylistId } = require('../utils/Identifier');
const { playlistResponse, songResponse } = require('../utils/Response');

class PlaylistService {
  constructor(db) {
    this._db = db;
  }

  async createPlaylist({ name, owner }) {
    const id = nanoid(16);

    const result = await this._db.query({
      text: 'INSERT INTO public.playlist (id, "name", "owner") VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    });

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add playlist.');
    }

    return generatePlaylistId(result.rows[0].id);
  }

  async getAllPlaylist(owner) {
    const id = getId(owner);
    const queryValue = {
      text: `
            WITH user_playlist AS (
                SELECT 
                    p.id, p.name, p.owner 
                FROM playlist p 
                WHERE p.id in ( 
                    select c."playlistId" FROM collaborations c where c."userId" = $1)
                UNION
                SELECT 
                    p.id, p.name, p.owner 
                FROM playlist p WHERE p.owner = $1;
            )
            SELECT 
                up.id, up.name, u.username 
            FROM user_playlist up LEFT JOIN users u ON up.owner = u.id 
            `,
      values: [id],
    };
    const result = await this._db.query(queryValue);
    return result.rows.map(playlistResponse);
  }

  async deletePlaylist(id) {
    const playlistId = getId(id);

    const result = await this._db.query({
      text: 'DELETE playlist WHERE id = $1 RETURNING id',
      values: [playlistId],
    });

    if (!result.rows.length) {
      throw new NotFoundError(`Failed to playlist. Playlist with id ${id} not found.`);
    }
  }

  async addSongToPlaylist({ playlistId, songId }) {
    if (this.isSongInPlaylist({ playlistId, songId })) {
      throw new InvariantError('Song already in playlist.');
    }

    await this._db.query({
      text: `
        INSERT INTO playlist_songs("playlistId", "songId") VALUES($1, $2)
      `,
      values: [getId(playlistId), getId(songId)],
    });
  }

  async getSongsFromPlaylist(id) {
    const result = await this._db.query({
      text: `
        select 
          p.id, p."name", p."owner", ps."songId", s.title, s.performer 
        from playlist p 
          left join playlist_songs ps ON p.id = ps."playlistId" 
          left join songs s on ps."songId" = s.id
        where ps."playlistId" = $1;
      `,
      values: [getId(id)],
    });

    const info = playlistResponse(result.rows[0]);
    const songs = result.rows[0].songId != null ? result.rows.map(songResponse) : [];

    return {
      playlist: info,
      songs,
    };
  }

  async deleteSongsFromPlaylist({ playlistId, songId }) {
    if (this.isSongInPlaylist({ playlistId, songId })) {
      throw new InvariantError('Song not in playlist.');
    }

    await this._db.query({
      text: 'DELETE FROM playlist_songs ps WHERE ps.playlistId = $1 AND ps.songId = $2 ',
      values: [getId(playlistId), getId(songId)],
    });
  }

  async validatePlaylistExist(playlistId) {
    const result = await this._db.query({
      text: 'SELECT id FROM playlist WHERE id = $1',
      values: [getId(playlistId)],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError(`Playlist with id ${playlistId} not found.`);
    }
  }

  async isSongInPlaylist({ playlistId, songId }) {
    const result = await this._db.query({
      text: `
        SELECT "songId" 
        FROM playlist_songs("playlistId", "songId") VALUES($1, $2)`,
      values: [getId(playlistId), getId(songId)],
    });

    return result.rowCount === 1;
  }
}

module.exports = PlaylistService;
