import fetch from 'node-fetch';

export default class ImgurApi {
  constructor(clientId) {
    this.clientId = clientId
    return this;
  }

  getAlbum(imgurUrl = "http://imgur.com/a/8ue1N", successCallback = () => {}, errorCallback = () => {}) {
    // regex from https://github.com/alexgisby/imgur-album-downloader/blob/master/imguralbum.py
    var imgurRegex = /(https?)\:\/\/(www\.)?(?:m\.)?imgur\.com\/(a|gallery)\/([a-zA-Z0-9]+)(\#[0-9]+)?/;
    var match = imgurRegex.exec(imgurUrl);

    if(match === null) {
      console.error(`"${imgurUrl}" is not valid Imgur Url!`);
      errorCallback();
    }
    else {
      var albumId = match[4];
      return fetch(`https://api.imgur.com/3/album/${albumId}`, {
        headers: {
          Authorization: `Client-ID ${this.clientId}`
        }
      }).then(response => {
        return response.json();
      }).then(json => {
        var images = json.data.images.map(image => {
          var links = image.link.split('.');
          var ext = links.pop();

          // t may replace with other thumbnail types
          // https://api.imgur.com/models/image
          return {
            ...image,
            thumbnail: `${links.join('.')}t.${ext}`
          };
        });
        var album = json.data;
        delete(album["images"])

        return successCallback({
          album: album,
          images: images
        });
      });
    }

  }
}
