import { writable } from 'svelte/store';

type Theme = 'light' | 'dark' | null;

const createThemeStore = () => {
	const { subscribe, set } = writable<{ theme: Theme }>({ theme: null });

	const toggleTheme = (themeData: string | null) => {
		let nextTheme: Theme | null;
		switch (themeData) {
			case 'dark':
				nextTheme = 'light';
				break;
			case 'light':
				nextTheme = null;
				break;
			default:
				nextTheme = 'dark';
				break;
		}

		set({ theme: nextTheme });
	};
	return {
		subscribe,
		toggleTheme
	};
};

const themeStore = createThemeStore();
export default themeStore;
