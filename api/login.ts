import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";

const authString = process.env.REACT_APP_KEYSTONE_TOKEN || ":";

export default (req: NowRequest, res: NowResponse) =>
  axios
    .post(`${process.env.REACT_APP_KEYSTONE_URL}/admin/api`, {
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
    .then(data =>
      res.json({
        userId: data.data.data.authenticateUserWithPassword.item.id,
        token: data.data.data.authenticateUserWithPassword.token
      })
    );
