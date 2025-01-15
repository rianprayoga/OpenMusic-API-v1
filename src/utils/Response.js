const { albumdId } = require('./Identifier');

const albumResponse = ({ id, name, year }) => ({
  id: albumdId(id),
  name,
  year,
});

module.exports = { albumResponse };
