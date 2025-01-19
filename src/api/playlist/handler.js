class PlaylistHandler {
  constructor(playlistService, songService, authorizationService, validator) {
    this._playlistService = playlistService;
    this._songService = songService;
    this._authorizationService = authorizationService;
    this._validator = validator;
  }

  async postCreatePlaylistHandler(request, h) {
    this._validator.validatePlaylistBody(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;
    const playlistId = await this._playlistService.createPlaylist({ name, owner: credentialId });

    const response = h.response(
      {
        status: 'success',
        data: {
          playlistId,
        },
      },
    );
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._playlistService.getAllPlaylist(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._authorizationService.validateAccess({ playlistId: id, userId: credentialId });

    await this._playlistService.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist deleted.',
    };
  }

  async postAddSongToPlaylistHandler(request, h) {
    this._validator.validateSongIdBody(request.payload);

    const { songId } = request.payload;
    await this._songService.validateSongExist(songId);

    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._authorizationService.validateAccess({ playlistId: id, userId: credentialId });

    await this._playlistService.addSongToPlaylist({ playlistId: id, songId });

    const response = h.response(
      {
        status: 'success',
        message: 'Song added.',
      },
    );
    response.code(201);
    return response;
  }

  async getPlaylistDetailHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._authorizationService.validateAccess({ playlistId: id, userId: credentialId });

    await this._playlistService.validatePlaylistExist(id);

    const playlist = await this._playlistService.getSongsFromPlaylist(id);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongsFromPlaylistHandler(request) {
    this._validator.validateSongIdBody(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._authorizationService.validateAccess({ playlistId: id, userId: credentialId });

    const { songId } = request.payload;
    await this._songService.validateSongExist(songId);
    await this._playlistService.deleteSongsFromPlaylist({ playlistId: id, songId });

    return {
      status: 'success',
      message: 'Song removed from playlist.',
    };
  }
}

module.exports = PlaylistHandler;
