import type { Auth0Client } from '@auth0/auth0-spa-js';

let auth0Client: Auth0Client | undefined;

export function setAuth0Client(client: Auth0Client) {
	auth0Client = client;
}

export function getAuth0Client(): Auth0Client | undefined {
	return auth0Client;
}
