import ImgurApi from '../utils/imgurApi';

export const UPDATE_IMAGES = 'UPDATE_IMAGES';

export function loadImagesSuccess(data) {
  return dispatch => {
    dispatch({
      type: UPDATE_IMAGES,
      ...data
    });
  }
}

export function loadImgurImages(imgurUrl) {
  return dispatch => {
    // Signup your own api key instead, or maybe I will make a setting page for this in the future.
    // It's free.
    new ImgurApi("2d55e15b4b93ae2").getAlbum(imgurUrl, data => {
      dispatch(loadImagesSuccess(data));
    });
  }
}
