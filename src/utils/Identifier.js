const generateAlbumdId = (id) => `album-${id}`;

const generateSongId = (id) => `song-${id}`;

const getId = (id) => id.slice(-16);

module.exports = { songId: generateSongId, albumdId: generateAlbumdId, getId };
