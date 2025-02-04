class ExportPlaylistHandler {
  constructor(authorizationService, producerServices, validator) {
    this._authorizationService = authorizationService;
    this._producerServices = producerServices;
    this._validator = validator;
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportBody(request.payload);

    const { targetEmail } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._authorizationService.validateOwner({ playlistId: id, userId: credentialId });

    await this._producerServices.sendMessage('export:playlist', JSON.stringify({
      playlistId: id,
      email: targetEmail,
    }));

    const response = h.response({
      status: 'success',
      message: 'We are processing your request.',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportPlaylistHandler;
