import { LOAD_IMGUR_IMAGES, UPDATE_DOWNLOAD_PROGRESS } from '../actions/images';

export default function imgur(state = {}, action) {
  switch (action.type) {
    case LOAD_IMGUR_IMAGES:
      return {
        ...state,
        album: action.album,
        images: action.images
      }
    case UPDATE_DOWNLOAD_PROGRESS:
      var image = state.images.find((image) => { return image.id == action.id });
      var index = state.images.indexOf(image);
      var images = state.images.slice();
      images[index].progress = action.progress;

      return {
        ...state,
        images: images
      }
    default:
      return state;
  }
}
