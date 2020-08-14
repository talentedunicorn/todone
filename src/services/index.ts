import bobaService from "./boba";
import localService from "./localStorage";

let service;

service = process.env.REACT_APP_OFFLINE_MODE ? localService : bobaService;

let { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS } = service;

export default {
  GET_TODOS,
  ADD_TODO,
  EDIT_TODO,
  TOGGLE_TODO,
  DELETE_TODOS
};
