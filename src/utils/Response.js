const { generateAlbumdId, generateSongId } = require('./Identifier');

const albumResponse = ({ id, name, year }) => ({
  id: generateAlbumdId(id),
  name,
  year,
});

const songResponse = ({ id, title, performer }) => ({
  id: generateSongId(id),
  title,
  performer,
});

const songExtendedResponse = ({
  id, title, year, genre, performer, duration, albumId,
}) => ({
  id: generateSongId(id),
  title,
  year,
  genre,
  performer,
  duration,
  albumId: generateAlbumdId(albumId),
});

module.exports = { albumResponse, songResponse, songExtendedResponse };
