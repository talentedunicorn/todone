import bobaService from "./boba";
import localService from "./localStorage";

let service;

// Select storage service
switch (process.env.REACT_APP_STORAGE_TYPE) {
  case "backend":
    service = bobaService;
    break;
  default:
    service = localService;
}

let { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS } = service;

export default {
  GET_TODOS,
  ADD_TODO,
  EDIT_TODO,
  TOGGLE_TODO,
  DELETE_TODOS
};
