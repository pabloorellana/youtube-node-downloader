var google = require('googleapis'),
  youtube = google.youtube('v3'),
  Q = require('q');

var API_KEY = 'AIzaSyAXrcd21IEsE_IGLa6a6apFTF-YZ0hfOK0';

function formatIds (ids) {
  if (ids instanceof Array) {
    return ids.join(',');
  }

  return ids.toString();
}

/**
 * Get one or more playlists by id.
 * @param  {String | Array} playlistIds [A playlist id or an array of those]
 * @return {Promise} [returns an object containing the playlist found]
 */
function getPlayLists (playlistIds) {
  var deferred = Q.defer();
  var query = {
    auth: API_KEY,
    part: 'snippet',
    pageToken: '',
    maxResults: 50,
    playlistId: formatIds(playlistIds)
  };

  youtube.playlistItems.list(query, function (err, playlist) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(playlist);
    }
  });

  return deferred.promise;
}

/**
 * Get one or more channels by id
 * @param  {String | Array} channelIds [A channel id or an array of those]
 * @return {Promise} [returns all the channels found]
 */
function getChannels (channelIds) {
  var deferred = Q.defer();
  var query = {
    auth: API_KEY,
    part: 'contentDetails, snippet',
    maxResults: 50,
    id: formatIds(channelIds)
  };

  youtube.channels.list(query, function (err, channelList) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(channelList);
    }
  });

  return deferred.promise;
}

function getVideos (videoIds) {
  var deferred = Q.defer();
  var query = {
    auth: API_KEY,
    part: 'snippet',
    maxResults: 50,
    id: formatIds(videoIds)
  };

  youtube.videos.list(query, function (err, videoList) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(videoList);
    }
  });

  return deferred.promise;
}

module.exports = {
  getPlayLists: getPlayLists,
  getChannels: getChannels,
  getVideos: getVideos
}
