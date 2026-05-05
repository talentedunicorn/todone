import { type Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { user, isLoggedin, token } from './stores';

const refreshRate = 10 * 60 * 60 * 1000;

export const authConfig = {
	clientId: import.meta.env.VITE_AUTH0_CLIENT,
	domain: import.meta.env.VITE_AUTH0_DOMAIN,
	redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
	cacheLocation: 'localstorage' as const
};

export const initAuth0Client = async () => {
	return await createAuth0Client({
		clientId: authConfig.clientId,
		domain: authConfig.domain,
		cacheLocation: authConfig.cacheLocation,
		authorizationParams: {
			redirect_uri: authConfig.redirectUri
		}
	});
};

export const checkAuth = async (auth0: Auth0Client) => {
	let intervalId: ReturnType<typeof setInterval>;
	const params = new URLSearchParams(window.location.search);
	if (params.has('code')) {
		await auth0.handleRedirectCallback();
		window.history.replaceState({}, document.title, '/');
	}

	token.subscribe((v) => {
		if (v === null) {
			logout(auth0);
		}
	});

	const _isAuthenticated = await auth0.isAuthenticated();
	isLoggedin.set(_isAuthenticated);

	if (_isAuthenticated) {
		user.set((await auth0.getUser()) || {});

		const { id_token } = await auth0.getTokenSilently({
			authorizationParams: {
				redirect_uri: authConfig.redirectUri
			},
			detailedResponse: true
		});

		token.set(id_token);

		intervalId = setInterval(async () => {
			const { id_token } = await auth0.getTokenSilently({
				authorizationParams: {
					redirect_uri: authConfig.redirectUri
				},
				detailedResponse: true
			});
			token.set(id_token);
		}, refreshRate);
	}

	return () => {
		intervalId && clearInterval(intervalId);
	};
};

export const login = async (auth0: Auth0Client) => {
	await auth0.loginWithRedirect();
};

export const logout = async (auth0: Auth0Client) => {
	await auth0.logout({
		async openUrl(url) {
			window.location.replace(url);
		}
	});
};
