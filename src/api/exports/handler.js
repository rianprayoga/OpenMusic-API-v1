class ExportPlaylistHandler {
  constructor(playlistService, authorizationService, producerServices, validator) {
    this._playlistService = playlistService;
    this._authorizationService = authorizationService;
    this._producerServices = producerServices;
    this._validator = validator;
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportBody(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._authorizationService.validateOwner({ playlistId: id, userId: credentialId });

    const playlist = await this._playlistService.getSongsFromPlaylist(id);
    await this._producerServices.sendMessage('export:playlist', JSON.stringify(playlist));

    const response = h.response({
      status: 'success',
      message: 'We are processing your request.',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportPlaylistHandler;
