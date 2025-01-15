class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateAlbumBody(request.payload);

    const { name, year } = request.payload;
    const id = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'New album added.',
      data: {
        albumId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler() {

  }

  async getSongHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putSongHandler(request) {
    this._validator.validateAlbumBody(request.payload);

    const { name, year } = request.payload;
    const { id } = request.params;

    await this._service.updateAlbumById(id, { name, year });
    return {
      status: 'success',
      message: `Album wiht id ${id} updated.`,
    };
  }

  async deleteSongHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: `Album wiht id ${id} deleted.`,
    };
  }
}

module.exports = SongHandler;
