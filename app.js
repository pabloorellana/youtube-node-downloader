var downloader = require('./lib/downloader.js'),
  youtubeApi = require('./lib/youtube-api.js'),
  downloader = require('./lib/downloader.js'),
  utils = require('./lib/utils.js'),
  async = require('./lib/async.js');

var flag = process.argv[2];

var url = process.argv[3]

var downloadTargetMap = {
  '-plist': downloadVideosByPlayListId,
  '-channel': downloadVideosByChannelId,
  '-video': downloadVideoById
};

var handler = downloadTargetMap[flag];
if (!handler) {
  console.log('Invalid option.');
  return;
}

handler(url).then(showResults);

function showResults (results) {
  var completed = results.filter((result) => {
    return result.state === 'resolved';
  }).length;

  var failed = results.filter((result) => {
    return result.state === 'rejected';
  });

  console.log('\n' + 'Completed:\t' + completed);
  console.log('Failed:\t' + failed.length + '\n');

  if (failed.length !== 0 ) {
    console.log('Details:' + '\n');
    failed.forEach((reason) => {
      console.log(reason.value + '\n');
    });
  }
};

function downloadVideosByPlayListId (playlistIds) {
  return youtubeApi.getPlayLists(playlistIds).then((playlist) => {
    utils.showPlayListInfo(playlist);
    return async.eachSeriesSettled(playlist, downloader.download);
  });
};

function downloadVideosByChannelId (channelIds) {
  return youtubeApi.getChannels(channelIds).then((channelList) => {
    return async.eachSeriesSettled(channelList, downloadVideosByPlayListId);
  });
};

function downloadVideoById (videoIds) {
  return youtubeApi.getVideos(videoIds).then((videos) => {
    return async.eachSeriesSettled(videos, downloader.download);
  });
};

