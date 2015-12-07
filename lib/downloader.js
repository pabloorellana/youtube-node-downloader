var fs = require('fs');
var ytdl = require('ytdl-core');
var async = require('async-q');
var Q = require('q');
var youtubeApi = require('./youtubeApi.js');
var progressBar = require('progress');


function downloadVideo (playListItem) {
  var deferred = Q.defer();

  console.log('Downloading: ' + playListItem.title)

  var bar = null;

  ytdl(playListItem.url)
    .on('response', function (response) {
      bar = new progressBar('  progress: :total/:current [:bar] :percent elapsed time: :elapsed', {
        complete: '=',
        incomplete: ' ',
        width: 50,
        total: parseInt(response.headers['content-length'], 10)
      });
    })
    .on('data', function (chunk) {
      if (bar) {
        bar.tick(chunk.length);
      }
    })
    .pipe(fs.createWriteStream(playListItem.title + '.flv'))
    .on('finish', function () {
      console.log();
      deferred.resolve(true);
    })
    .on('error', function (err) {
      console.log('Error: ', err);
      deferred.reject(false);
    });

  return deferred.promise;
}

function formatPlayListItems (playListItems) {
  return playListItems.map(function (item) {
    return {
      title: item.snippet.title,
      url: 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId
    }
  });
}

function formatChannelItems (channelItems) {
  return channelItems.map(function (item) {
    return item.contentDetails.relatedPlaylists.uploads
  });
}

function formatVideoItems (videoItems) {
  return videoItems.map(function (item) {
    return {
      title: item.snippet.title,
      url: 'https://www.youtube.com/watch?v=' + item.id
    }
  })
}

function showPlayListInfo (playlists) {
  console.log('Videos found: ' + playlists.length);
}

function showChannelInfo (channels) {
  channels.forEach(function (channel) {
    console.log('Channel: ' + channel.snippet.title);
  });
};

function downloadVideosByPlayListId (playlistIds) {
  return youtubeApi.getPlayLists(playlistIds).then(function (playList) {
    showPlayListInfo(playList.items)
    return formatPlayListItems(playList.items);
  }).then(function (playListItems) {
    return async.eachSeries(playListItems, downloadVideo)
  });
}

function downloadVideosByChannelId (channelIds) {
  return youtubeApi.getChannels(channelIds).then(function (channelList) {
    showChannelInfo(channelList.items)
    return formatChannelItems(channelList.items);
  }).then(function (uploads) {
    return async.eachSeries(uploads, downloadVideosByPlayListId);
  });
}

function downloadVideoById (videoIds) {
  return youtubeApi.getVideos(videoIds).then(function (videoList) {
    return formatVideoItems(videoList.items);
  }).then(function (videos) {
    return async.eachSeries(videos, downloadVideo);
  });
}

module.exports = {
  downloadVideoById: downloadVideoById,
  downloadVideosByChannelId: downloadVideosByChannelId,
  downloadVideosByPlayListId: downloadVideosByPlayListId,
}
