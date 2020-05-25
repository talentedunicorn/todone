import axios from "axios";

const backend = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

const LOGIN = ({ username, password }: any) => {
  return backend
    .post("/auth/local", { identifier: username, password })
    .then((data: any) => {
      SET_TOKEN(data.data.jwt);
      return data.data.jwt;
    });
};

const SET_TOKEN = (token: string) => {
  backend.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  window.localStorage.setItem("todone", JSON.stringify(token));
};

// Queries
const GET_TODOS = () => backend.get("/todos").then(res => res.data);

const ADD_TODO = (content: String) =>
  backend.post("/todos", { content, completed: false }).then(res => res.data);

const TOGGLE_TODO = (id: Number, completed: Boolean) =>
  backend.put(`/todos/${id}`, { completed }).then(res => res.data);

const DELETE_TODOS = (ids: Number[]) => backend.delete(`/todos/${ids[0]}`);

const EDIT_TODO = (id: Number, content: String) =>
  backend.put(`/todos/${id}`, { content }).then(res => res.data);

export default {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_TODO,
  EDIT_TODO,
  DELETE_TODOS
};

export { LOGIN, SET_TOKEN };
