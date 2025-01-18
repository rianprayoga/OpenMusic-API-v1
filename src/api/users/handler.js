class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(request, h) {
    this._validator.validatePostUserPayload(request.payload);

    const {
      username, password, fullname,
    } = request.payload;
    const id = await this._service.addUser({
      username, password, fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'New User added.',
      data: {
        userId: id,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UserHandler;
