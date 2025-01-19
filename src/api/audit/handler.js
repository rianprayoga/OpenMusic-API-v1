class AuditHandler {
  constructor(playlistService, authorizationService, service) {
    this._playlistService = playlistService;
    this._authorizationService = authorizationService;
    this._service = service;
  }

  async getActivitiesHandler(request, h) {
    const { id } = request.params;
    await this._playlistService.validatePlaylistExist(id);

    const { id: credentialId } = request.auth.credentials;
    await this._authorizationService.validateAccess({ playlistId: id, userId: credentialId });

    const data = await this._service.getAudits(id);

    const response = h.response({
      status: 'success',
      data,
    });
    return response;
  }
}

module.exports = AuditHandler;
