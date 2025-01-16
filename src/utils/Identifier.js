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

module.exports = { generateSongId, generateAlbumdId, getId };
