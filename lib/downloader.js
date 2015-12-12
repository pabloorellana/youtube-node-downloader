var fs = require('fs'),
  Q = require('q'),
  ytdl = require('ytdl-core'),
  downloadQueueManager = require('./download-queue-manager.js'),
  progressBar = require('progress');

const progressBarConfig = 'progress: :total/:current [:bar] :percent elapsed time: :elapsed';
const youtubeUrl = 'https://www.youtube.com/watch?v=';

function buildUrl (id) {
  return youtubeUrl + id;
};

function videoAlreadyDownloaded (videoId) {
  var storedVideo = downloadQueueManager.getById(videoId);
  return storedVideo && storedVideo.downloaded === true;
};

function initProgressBar (total) {
  return new progressBar(progressBarConfig, {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: total
  });
};

function buildVideo (video) {
  return {
    'id': video.id,
    'type': 'video', // TODO [12/12/2015] Add support to save play list and channels
    'title': video.title,
    'downloaded': false
  };
};

function download (video) {
  if (videoAlreadyDownloaded(video.id)) {
    console.log('Already downloaded: ' + video.title);
    return Q.resolve();
  }

  var deferred = Q.defer(),
    bar = null,
    video = buildVideo(video);

  ytdl.getInfo(buildUrl(video.id), (err, result) => {
    if (err) {
      console.log('\n', err);
      deferred.reject(err);
      return deferred.promise;
    }

    ytdl.downloadFromInfo(result)
      .on('response', (response) => {
        console.log('\nDownloading:\t' + video.title);
        bar = initProgressBar(parseInt(response.headers['content-length'], 10));
        downloadQueueManager.save(video);
      })
      .on('data', (chunk) => {
        bar.tick(chunk.length);
      })
      .pipe(fs.createWriteStream(video.title + '.flv'))
      .on('finish', () => {
        video.downloaded = true;
        downloadQueueManager.save(video);
        deferred.resolve();
      })
      .on('error', (err) => {
        console.log('Error: ', err);
        deferred.reject();
      });
  })

  return deferred.promise;
};

module.exports = {
  download
};
