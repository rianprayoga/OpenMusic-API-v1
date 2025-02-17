const generateAlbumdId = (id) => {
  if (id === undefined || id === null) return undefined;

  return `album-${id}`;
};

const generateSongId = (id) => {
  if (id === undefined || id === null) return undefined;

  return `song-${id}`;
};

const getId = (id) => {
  if (id === undefined || id === null) return undefined;

  return id.slice(-16);
};

const generateUserId = (id) => {
  if (id === undefined || id === null) return undefined;

  return `user-${id}`;
};

const generatePlaylistId = (id) => {
  if (id === undefined || id === null) return undefined;

  return `playlist-${id}`;
};

const collabId = (id) => {
  if (id === undefined || id === null) return undefined;

  return `colab-${id}`;
};

module.exports = {
  generateSongId,
  generateAlbumdId,
  getId,
  generateUserId,
  generatePlaylistId,
  collabId,
};
