class AlbumHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
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

  async getAlbumHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumHandler(request) {
    this._validator.validateAlbumBody(request.payload);

    const { name, year } = request.payload;
    const { id } = request.params;

    await this._service.updateAlbumById(id, { name, year });
    return {
      status: 'success',
      message: `Album wiht id ${id} updated.`,
    };
  }

  async deleteAlbumHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: `Album wiht id ${id} deleted.`,
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateImageBody(cover.hapi.headers);

    const fileLocation = await this._storageService.writeFile(cover, cover.hapi);

    await this._service.addCover({ id, location: fileLocation });

    const response = h.response({
      status: 'success',
      message: 'Cover uploaded.',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumHandler;
