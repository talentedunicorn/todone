import axios from "axios";

const backend = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

let token = window.localStorage.getItem("token");

if (token) {
  backend.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const LOGIN = ({ username, password }: any) => {
  return backend
    .post("/auth/local", { identifier: username, password })
    .then((data: any) => {
      backend.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.data.jwt}`;
      return data.data.jwt;
    });
};

// Queries
const GET_TODOS = () => backend.get("/todos").then(res => res.data);

const ADD_TODO = (content: string) =>
  backend.post("/todos", { content, completed: false }).then(res => res.data);

const TOGGLE_TODO = (id: any, completed: Boolean) =>
  backend.put(`/todos/${id}`, { completed }).then(res => res.data);

const DELETE_TODOS = (ids: any[]) => backend.delete(`/todos/${ids[0]}`);

const EDIT_TODO = (id: any, content: String) =>
  backend.put(`/todos/${id}`, { content }).then(res => res.data);

export default {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_TODO,
  EDIT_TODO,
  DELETE_TODOS
};

export { LOGIN };
