import axios from "axios";

const authString = process.env.REACT_APP_KEYSTONE_TOKEN || ":";
let userId = "";
const keystoneGraphQL = axios.create({
  baseURL: `${process.env.REACT_APP_KEYSTONE_URL}/admin/api`
});

const LOGIN = () =>
  keystoneGraphQL
    .post("", {
      query: `
    mutation ($email: String!, $password: String!) {
      authenticateUserWithPassword(email: $email, password: $password) {
        token
        item {
          id
        }
      }
    }
  `,
      variables: {
        email: authString.substr(0, authString.indexOf(":")),
        password: authString.substr(authString.indexOf(":") + 1)
      }
    })
    .then(data => {
      userId = data.data.data.authenticateUserWithPassword.item.id;
      keystoneGraphQL.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.data.data.authenticateUserWithPassword.token}`;
    });

// Queries
const GET_TODOS = () =>
  keystoneGraphQL
    .post("", {
      query: `
  query {
    allTodos {
      id
      text
      completed
    }
  }
`
    })
    .then(data => data.data.data.allTodos);

const ADD_TODO = (text: String) =>
  keystoneGraphQL
    .post("", {
      query: `
    mutation ($text: String!, $id: ID!){
      createTodo(data: { text: $text, title: $text, owner: { connect: { id: $id } } }) {
        id
        text
        completed
      }
    }
    `,
      variables: {
        text,
        id: userId
      }
    })
    .then(data => data.data.data.createTodo);

const TOGGLE_TODO = (id: Number, completed: Boolean) =>
  keystoneGraphQL
    .post("", {
      query: `
    mutation ($id: ID!, $completed: Boolean) {
      updateTodo(id: $id, data: { completed: $completed }) {
        id
        text
        completed
      }
    }
  `,
      variables: {
        id,
        completed
      }
    })
    .then(data => data.data.data.updateTodo);

const DELETE_TODOS = (ids: Number[]) =>
  keystoneGraphQL.post("", {
    query: `
    mutation ($ids: [ID!]) {
      deleteTodos(ids: $ids) { 
        id 
      }
    }
  `,
    variables: {
      ids
    }
  });

const EDIT_TODO = (id: Number, text: String) =>
  keystoneGraphQL
    .post("", {
      query: `
    mutation ($id: ID!, $text: String) {
      updateTodo(id: $id, data: { text: $text }) {
        id
        text
        completed
      }
    }
  `,
      variables: {
        id,
        text
      }
    })
    .then(data => data.data.data.updateTodo);

export default {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_TODO,
  EDIT_TODO,
  DELETE_TODOS,
  LOGIN
};
