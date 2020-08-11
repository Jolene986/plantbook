import {
  SET_PLANTS,
  SET_PLANT,
  SET_USER_DATA,
  SET_USER_PLANTS,
  LIKE_PLANT,
  UNLIKE_PLANT,
  LOADING_DATA,
  DELETE_PLANT,
  POST_PLANT,
  DELETE_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  POST_COMMENT,
  EDIT_COMMENT,
} from "../types";

const initialState = {
  plants: [],
  userData: [],
  userPlants: [],
  plant: {},
};

export default function (state = initialState, action) {
  let index;
  let userPlantindex;
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_PLANTS:
      return {
        ...state,
        plants: action.payload,
        loading: false,
      };
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
        loading: false,
      };
    case SET_USER_PLANTS:
      return {
        ...state,
        userPlants: action.payload,
        loading: false,
      };
    case LIKE_PLANT:
    case UNLIKE_PLANT:
      index = state.plants.findIndex(
        (plant) => plant.plantId === action.payload.plantId
      );
      state.plants[index] = action.payload; //replaceing the actual plant in plants state array
      //the same for the user Plants array
      userPlantindex = state.userPlants.findIndex(
        (plant) => plant.plantId === action.payload.plantId
      );
      state.userPlants[userPlantindex] = action.payload;
      // if plant is liked/unliked on plant page
      if (state.plant.plantId === action.payload.plantId) {
        state.plant.likes = action.payload.likes;
      }
      return {
        ...state,
      };
    case DELETE_PLANT:
      index = state.plants.findIndex(
        (plant) => plant.plantId === action.payload //payload is the id of deleted plant
      );

      state.plants.splice(index, 1);

      userPlantindex = state.userPlants.findIndex(
        (plant) => plant.plantId === action.payload //payload is the id of deleted plant
      );

      state.userPlants.splice(userPlantindex, 1);
      return {
        ...state,
      };
    case POST_PLANT:
      if (state.userData.username === action.payload.username) {
        // if user is on his profile page and adds a plant
        return {
          ...state,
          userPlants: [action.payload, ...state.userPlants],
        };
      }
      return {
        ...state,
        plants: [action.payload, ...state.plants],
      };
    case SET_PLANT:
      return {
        ...state,
        plant: action.payload,
      };
    case LIKE_COMMENT:
    case UNLIKE_COMMENT:
      index = state.plant.comments.findIndex(
        (comment) => comment.commentId === action.payload.commentId
      );
      state.plant.comments[index] = action.payload;

      return {
        ...state,
        plant: {
          ...state.plant,
          comments: [...state.plant.comments],
        },
      };
    case DELETE_COMMENT:
      index = state.plant.comments.findIndex(
        (comment) => comment.commentId === action.payload
      );
      state.plant.comments.splice(index, 1);
      return {
        ...state,
        plant: {
          ...state.plant,
          comments: [...state.plant.comments],
          commentCount: state.plant.commentCount - 1,
        },
      };
    case POST_COMMENT:
      return {
        ...state,
        plant: {
          ...state.plant,
          comments: [action.payload, ...state.plant.comments],
        },
      };
    case EDIT_COMMENT:
      index = state.plant.comments.findIndex(
        (comment) => comment.commentId === action.payload.id
      );

      state.plant.comments[index].body = action.payload.comment.body;

      return {
        ...state,
        plant: {
          ...state.plant,
          comments: [...state.plant.comments],
        },
      };

    default:
      return state;
  }
}
