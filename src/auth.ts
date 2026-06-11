import { type Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { user, isLoggedin } from './stores';

let client: Auth0Client | undefined;

export const initAuth = async () => {
	client = await createAuth0Client({
		clientId: import.meta.env.VITE_AUTH0_CLIENT,
		domain: import.meta.env.VITE_AUTH0_DOMAIN,
		authorizationParams: {
			redirect_uri: typeof window !== 'undefined' ? window.location.origin : ''
		},
		useRefreshTokens: true
	});
	return client;
};

export function getClient(): Auth0Client | undefined {
	return client;
}

export const checkAuth = async (auth0: Auth0Client) => {
	const params = new URLSearchParams(window.location.search);
	if (params.has('code')) {
		await auth0.handleRedirectCallback();
		window.history.replaceState({}, document.title, '/');
	}

	const _isAuthenticated = await auth0.isAuthenticated();
	isLoggedin.set(_isAuthenticated);

	if (_isAuthenticated) {
		user.set((await auth0.getUser()) || {});
	}
};

export const login = async () => {
	const auth0 = client;
	if (!auth0) return;
	await auth0.loginWithRedirect();
};

export const logout = async () => {
	const auth0 = client;
	if (!auth0) return;
	await auth0.logout({
		async openUrl(url) {
			window.location.replace(url);
		}
	});
};
