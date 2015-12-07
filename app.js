var downloader = require('./lib/downloader.js');

var flag = process.argv[2];

var url = process.argv[3]

var downloadTargetMap = {
  '-plist': downloader.downloadVideosByPlayListId,
  '-channel': downloader.downloadVideosByChannelId,
  '-video': downloader.downloadVideoById
};

var handler = downloadTargetMap[flag];
if (!handler) {
  console.log('Invalid option.');
  return;
}

handler(url).catch(function (err) {
  console.log(err);
});
