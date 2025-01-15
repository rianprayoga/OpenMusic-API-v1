const generateAlbumdId = (id) => {
  if (id === undefined) return null;

  return `album-${id}`;
};

const generateSongId = (id) => `song-${id}`;

const getId = (id) => id.slice(-16);

module.exports = { generateSongId, generateAlbumdId, getId };
