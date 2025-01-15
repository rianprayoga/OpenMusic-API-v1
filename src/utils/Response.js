const { albumdId, songId } = require('./Identifier');

const albumResponse = ({ id, name, year }) => ({
  id: albumdId(id),
  name,
  year,
});

const songResponse = ({ id, title, performer }) => ({
  id: songId(id),
  title,
  performer,
});

const songExtendedResponse = ({
  id, title, year, genre, performer, duration, albumId,
}) => ({
  id: songId(id),
  title,
  year,
  genre,
  performer,
  duration,
  albumId: albumId(albumId),
});

module.exports = { albumResponse, songResponse, songExtendedResponse };
