import { type Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { user, isLoggedin, token } from './stores';

// Default Auth0 expiration time is 10 hours or something like that.
// If you want to get fancy you can parse the JWT token and get
// token's actual expiration time.
const refreshRate = 10 * 60 * 60 * 1000;

// let auth0: Auth0Client;

export const initAuth0Client = async () => {
	return await createAuth0Client({
		clientId: import.meta.env.VITE_AUTH0_CLIENT,
		domain: import.meta.env.VITE_AUTH0_DOMAIN,
		cacheLocation: 'localstorage',
		authorizationParams: {
			redirect_uri: window.location.origin
		}
	});
};

export const checkAuth = async (auth0: Auth0Client) => {
	let intervalId: ReturnType<typeof setInterval>;
	const params = new URLSearchParams(window.location.search);
	// if code then login success
	if (params.has('code')) {
		// Let the Auth0 SDK do it's stuff - save some state, etc.
		await auth0.handleRedirectCallback();
		// Can be smart here and redirect to original path instead of root
		window.history.replaceState({}, document.title, '/');
	}

	const _isAuthenticated = await auth0.isAuthenticated();
	isLoggedin.set(_isAuthenticated);

	if (_isAuthenticated) {
		// while on it, fetch the user info
		user.set((await auth0.getUser()) || {});

		// Get the access token. Make sure to supply audience property
		// in Auth0 config, otherwise you will soon start throwing stuff!
		const { id_token } = await auth0.getTokenSilently({
			authorizationParams: {
				redirect_uri: window.location.origin
			},
			detailedResponse: true
		});

		token.set(id_token);

		// refresh token after specific period or things will stop
		// working. Useful for long-lived apps like dashboards.
		intervalId = setInterval(async () => {
			const { id_token } = await auth0.getTokenSilently({
				authorizationParams: {
					redirect_uri: window.location.origin
				},
				detailedResponse: true
			});
			token.set(id_token);
		}, refreshRate);
	}
	// });

	// clear token refresh interval on component unmount
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
