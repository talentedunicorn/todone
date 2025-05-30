import { type Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import userStore from './stores/user';

const { setUser, setToken, setIsLoggedIn } = userStore;
// Default Auth0 expiration time is 10 hours or something like that.
// If you want to get fancy you can parse the JWT token and get
// token's actual expiration time.
const refreshRate = 10 * 60 * 60 * 1000;

const redirect_uri = window.location.origin;

export const initAuth0Client = async () => {
	return await createAuth0Client({
		clientId: import.meta.env.VITE_AUTH0_CLIENT,
		domain: import.meta.env.VITE_AUTH0_DOMAIN,
		cacheLocation: 'localstorage',
		authorizationParams: {
			redirect_uri
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

	userStore.subscribe((v) => {
		if (!v.token) {
			logout(auth0);
		}
	});

	const _isAuthenticated = await auth0.isAuthenticated();
	setIsLoggedIn(_isAuthenticated);

	if (_isAuthenticated) {
		// while on it, fetch the user info
		setUser((await auth0.getUser()) || {});

		// Get the access token. Make sure to supply audience property
		// in Auth0 config, otherwise you will soon start throwing stuff!
		const { id_token } = await auth0.getTokenSilently({
			authorizationParams: {
				redirect_uri
			},
			detailedResponse: true
		});

		setToken(id_token);

		// refresh token after specific period or things will stop
		// working. Useful for long-lived apps like dashboards.
		intervalId = setInterval(async () => {
			await auth0
				.getTokenSilently({
					authorizationParams: {
						redirect_uri
					},
					detailedResponse: true
				})
				.then(({ id_token }) => {
					setToken(id_token);
				})
				.catch(() => {
					// If token fails log out
					logout(auth0);
				});
		}, refreshRate);
	}

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
