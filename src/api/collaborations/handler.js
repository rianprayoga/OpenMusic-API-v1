class CollabsHandler {
  constructor(
    collabsService,
    playlistService,
    authorizationService,
    userService,
    validator,
  ) {
    this._collabsService = collabsService;
    this._playlistService = playlistService;
    this._authorizationService = authorizationService;
    this._userService = userService;
    this._validator = validator;
  }

  async postCollabsHandler(request, h) {
    this._validator.validateCollabBody(request.payload);

    const { playlistId, userId } = request.payload;
    await this._playlistService.validatePlaylistExist(playlistId);
    await this._userService.validateUserExist(userId);

    const { id: credentialId } = request.auth.credentials;
    await this._authorizationService.validateOwner({ playlistId, userId: credentialId });

    const id = await this._collabsService.addCollaboration({ playlistId, userId });
    const response = h.response({
      status: 'success',
      data: {
        collaborationId: id,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollabsHandler(request, h) {
    this._validator.validateCollabBody(request.payload);

    const { playlistId, userId } = request.payload;
    await this._playlistService.validatePlaylistExist(playlistId);
    await this._userService.validateUserExist(userId);

    const { id: credentialId } = request.auth.credentials;
    await this._authorizationService.validateOwner({ playlistId, userId: credentialId });

    await this._collabsService.deleteCollaboration({ playlistId, userId });

    const response = h.response({
      status: 'success',
      message: 'Collaboration deleted.',
    });
    return response;
  }
}

module.exports = CollabsHandler;
