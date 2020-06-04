import axios from "axios";

const backend = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

const setToken = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const LOGIN = ({ username, password }: any) => {
  return backend
    .post("/auth/local", { identifier: username, password })
    .then((data: any) => data.data.jwt);
};

// Queries
const GET_TODOS = (token: string) =>
  backend.get("/todos", { ...setToken(token) }).then(res => res.data);

const ADD_TODO = (content: string, token: string) =>
  backend
    .post("/todos", { content, completed: false }, { ...setToken(token) })
    .then(res => res.data);

const TOGGLE_TODO = (id: Number, completed: Boolean, token: string) =>
  backend
    .put(`/todos/${id}`, { completed }, { ...setToken(token) })
    .then(res => res.data);

const DELETE_TODOS = (ids: Number[], token: string) =>
  backend.delete(`/todos/${ids[0]}`, { ...setToken(token) });

const EDIT_TODO = (id: Number, content: string, token: string) =>
  backend
    .put(`/todos/${id}`, { content }, { ...setToken(token) })
    .then(res => res.data);

export default {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_TODO,
  EDIT_TODO,
  DELETE_TODOS
};

export { LOGIN };
