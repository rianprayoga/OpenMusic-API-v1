class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongBody(request.payload);

    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;
    const id = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'New song added.',
      data: {
        songId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;

    const songs = await this._service.getSongs({ title, performer });
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSong(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongHandler(request) {
    this._validator.validateSongBody(request.payload);

    const {
      title, year, genre, performer, duration, albumdId,
    } = request.payload;
    const { id } = request.params;

    await this._service.updateSong(id, {
      title, year, genre, performer, duration, albumdId,
    });
    return {
      status: 'success',
      message: `Song wiht id ${id} updated.`,
    };
  }

  async deleteSongHandler(request) {
    const { id } = request.params;
    await this._service.deleteSong(id);
    return {
      status: 'success',
      message: `Song wiht id ${id} deleted.`,
    };
  }
}

module.exports = SongHandler;
