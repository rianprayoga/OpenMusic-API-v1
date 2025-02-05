class AlbumHandler {
  constructor(service, storageService, cacheService, likeService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._cacheService = cacheService;
    this._likeService = likeService;
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

  async postLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.validateAlbumExist(albumId);

    await this._likeService.like({ userId, albumId });
    await this._cacheService.delete(`like:${albumId}`);

    const response = h.response({
      status: 'success',
      message: 'Liked.',
    });
    response.code(201);
    return response;
  }

  async deleteLikeAlbumHandler(request) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.validateAlbumExist(albumId);

    await this._likeService.removeLike({ userId, albumId });
    await this._cacheService.delete(`like:${albumId}`);

    return {
      status: 'success',
      message: 'Unliked.',
    };
  }

  async getLikeAlbumHandler(request, h) {
    const { id } = request.params;

    await this._service.validateAlbumExist(id);

    const res = await this._cacheService.get(`like:${id}`);
    if (res == null) {
      const likeNum = await this._likeService.getLike(id);
      await this._cacheService.set(`like:${id}`, likeNum);
      const response = h.response({
        status: 'success',
        data: {
          likes: Number(likeNum),
        },
      });
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        likes: Number(res),
      },
    })
      .header('X-Data-Source', 'cache');

    return response;
  }
}

module.exports = AlbumHandler;
