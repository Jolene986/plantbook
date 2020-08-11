import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_PLANT,
  UNLIKE_PLANT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  MARK_NOTIFICATIONS_READ,
} from "../types";

//user state
const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  commentlikes: [],
  notifications: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER: {
      return {
        ...state,
        loading: true,
      };
    }
    case LIKE_PLANT:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            username: state.credentials.username,
            plantId: action.payload.plantId,
          },
        ],
      };
    case UNLIKE_PLANT:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.plantId !== action.payload.plantId
        ),
      };
    case LIKE_COMMENT:
      return {
        ...state,
        commentlikes: [
          ...state.commentlikes,
          {
            username: state.credentials.username,
            commentId: action.payload.commentId,
          },
        ],
      };
    case UNLIKE_COMMENT:
      return {
        ...state,
        commentlikes: state.commentlikes.filter(
          (like) => like.commentId !== action.payload.commentId
        ),
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((notification) => (notification.read = true));
      return {
        ...state,
      };
    default:
      return state;
  }
}
