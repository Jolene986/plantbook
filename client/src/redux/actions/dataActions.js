import axios from "axios";
import {
  SET_PLANTS,
  LOADING_DATA,
  LIKE_PLANT,
  UNLIKE_PLANT,
  SET_USER_DATA,
  SET_USER_PLANTS,
  SET_ERRORS,
  DELETE_PLANT,
  LOADING_UI,
  STOP_LOADING,
  POST_PLANT,
  CLEAR_ERRORS,
  SET_PLANT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  DELETE_COMMENT,
  POST_COMMENT,
  EDIT_COMMENT,
} from "../types";

//Get all Plants
export const getPlants = () => (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });
  axios
    .get("/plants")
    .then((res) => {
      dispatch({
        type: SET_PLANTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_PLANTS,
        payload: [],
      });
    });
};
// Get User and their plants
export const getUsersAndPlants = (username) => (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });
  axios
    .get(`/user/${username}`)
    .then((res) => {
      dispatch({
        type: SET_USER_DATA,
        payload: res.data.user,
      });
      dispatch({
        type: SET_USER_PLANTS,
        payload: res.data.plants,
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: SET_USER_DATA,
        payload: [],
      });
      dispatch({
        type: SET_USER_PLANTS,
        payload: [],
      });
    });
};
// Post a Plant
export const postPlant = (newPlant) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/plant", newPlant)
    .then((res) => {
      dispatch({
        type: POST_PLANT,
        payload: res.data,
      });
      dispatch({
        type: CLEAR_ERRORS,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

//Get one plant
export const getOnePlant = (plantId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/plant/${plantId}`)
    .then((res) => {
      dispatch({
        type: SET_PLANT,
        payload: res.data,
      });
      dispatch({
        type: STOP_LOADING,
      });
    })
    .catch((err) => console.log(err));
};

//Like a Plant

export const likePlant = (plantId) => (dispatch) => {
  axios
    .get(`/plant/${plantId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_PLANT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//Unlike a Plant

export const unlikePlant = (plantId) => (dispatch) => {
  axios
    .get(`/plant/${plantId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_PLANT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// Delete plant
export const deletePlant = (plantId) => (dispatch) => {
  axios
    .delete(`/plant/${plantId}`)
    .then(() => {
      dispatch({
        type: DELETE_PLANT,
        payload: plantId,
      });
    })
    .catch((err) => console.log(err));
};

//Like a Comment

export const likeComment = (commentId) => (dispatch) => {
  axios
    .get(`/comment/${commentId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_COMMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
//Unlike a Comment

export const unlikeComment = (commentId) => (dispatch) => {
  axios
    .get(`/comment/${commentId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_COMMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Delete comment
export const deleteComment = (commentId) => (dispatch) => {
  axios
    .delete(`/comment/${commentId}`)
    .then(() => {
      dispatch({
        type: DELETE_COMMENT,
        payload: commentId,
      });
    })
    .catch((err) => console.log(err));
};
// Post a comment

export const postComment = (plantId, commentData) => (dispatch) => {
  axios
    .post(`/plant/${plantId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: POST_COMMENT,
        payload: res.data,
      });
      dispatch({
        type: CLEAR_ERRORS,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

//Edit Comment
export const editComment = (commentId, body) => (dispatch) => {
  axios
    .post(`/comment/${commentId}/edit`, body)
    .then(() => {
      dispatch({
        type: EDIT_COMMENT,
        payload: { id: commentId, comment: body },
      });
    })
    .catch((err) => console.log(err));
};
