import ImgurApi from '../utils/imgurApi';

export const LOAD_IMGUR_IMAGES = 'LOAD_IMGUR_IMAGES';
export const UPDATE_DOWNLOAD_PROGRESS = 'UPDATE_DOWNLOAD_PROGRESS'

export function loadImgurImages(imgurUrl) {
  return dispatch => {
    // Signup your own api key instead, or maybe I will make a setting page for this in the future.
    // It's free.
    new ImgurApi("2d55e15b4b93ae2").getAlbum(imgurUrl, data => {
      dispatch({
        type: LOAD_IMGUR_IMAGES,
        ...data
      });
    });
  }
}

export function updateDownloadProgress(imgurId, progress) {
  return dispatch => {
    dispatch({
      type: UPDATE_DOWNLOAD_PROGRESS,
      id: imgurId,
      progress: progress
    });
  }
}
