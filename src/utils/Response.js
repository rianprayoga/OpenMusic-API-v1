const { albumdId } = require("./Identifier");

const albumResponse = ({ id, name, year }) => ({
  albumId: albumdId(id),
  name,
  year,
});

module.exports = { albumResponse };
