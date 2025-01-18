class AuthHandler {
  constructor(userService, authService, tokenManager, validator) {
    this._userService = userService;
    this._authService = authService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthUserHandler(request, h) {
    this._validator.validateAuthBody(request.payload);

    const { username, password } = request.payload;
    const id = await this._userService.verifyUserCredential(username, password);
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    this._authService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthHandler(request, h) {
    this._validator.validateRefreshTokenBody(request.payload);

    const { refreshToken } = request.payload;

    await this._authService.verifyRefreshToken(refreshToken);
    const id = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });

    return response;
  }

  async deleteAuthHandler(request, h) {
    this._validator.validateRefreshTokenBody(request.payload);

    const { refreshToken } = request.payload;
    await this._authService.verifyRefreshToken(refreshToken);
    await this._authService.deleteRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Referesh token deleted.',
    });

    return response;
  }
}

module.exports = AuthHandler;
