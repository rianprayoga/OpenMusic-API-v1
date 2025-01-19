const { generateAlbumdId, generateSongId, generatePlaylistId } = require('./Identifier');

const albumResponse = ({
  id, name, year, songs,
}) => ({
  id: generateAlbumdId(id),
  name,
  year,
  songs,
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

const playlistResponse = ({
  id, name, username, songs,
}) => ({
  id: generatePlaylistId(id),
  name,
  username,
  songs,
});

module.exports = {
  albumResponse, songResponse, songExtendedResponse, playlistResponse,
};
