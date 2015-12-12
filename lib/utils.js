function formatPlayListItems (playListItems) {
  return playListItems.map((item) => {
    return {
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      id: item.snippet.resourceId.videoId
    }
  });
};

function formatChannelItems (channelItems) {
  return channelItems.map((item) => {
    return item.contentDetails.relatedPlaylists.uploads
  });
};

function formatVideoItems (videoItems) {
  return videoItems.map((item) => {
    return {
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      id: item.id
    }
  })
};

function showPlayListInfo (playlists) {
  console.log('\nChannel:\t' + playlists[0].channelTitle);
  console.log('Videos found:\t' + playlists.length + '\n');
};

module.exports = {
  formatPlayListItems,
  formatChannelItems,
  formatVideoItems,
  showPlayListInfo
};