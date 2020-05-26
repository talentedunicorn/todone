import bobaService, { LOGIN as bobaLogin } from "./boba";
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

const LOGIN = (creds: any) => {
  if (process.env.REACT_APP_STORAGE_TYPE === "offline") {
    return new Promise(resolve => resolve("offline"));
  } else {
    return bobaLogin(creds).then(data => {
      window.localStorage.setItem("token", data);
      return data;
    });
  }
};

const LOGOUT = () => {
  return window.localStorage.removeItem("token");
};

let { GET_TODOS, ADD_TODO, EDIT_TODO, TOGGLE_TODO, DELETE_TODOS } = service;

export default {
  GET_TODOS,
  ADD_TODO,
  EDIT_TODO,
  TOGGLE_TODO,
  DELETE_TODOS
};

export { LOGIN, LOGOUT };
