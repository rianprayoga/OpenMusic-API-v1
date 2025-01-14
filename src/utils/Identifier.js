const generateAlbumdId = (id) =>{
    return 'album-'+id;
}

const generateSongId = (id) => {
    return 'song-'+id;
}

const getId = (id) =>{
    return id.slice(-16);
}

module.exports = {songId: generateSongId, albumdId: generateAlbumdId, getId};