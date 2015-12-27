import { UPDATE_IMAGES } from '../actions/images';

export default function imgur(state = {}, action) {
  switch (action.type) {
    case UPDATE_IMAGES:
      return {
        ...state,
        album: action.album,
        images: action.images
      }
    default:
      return state;
  }
}
