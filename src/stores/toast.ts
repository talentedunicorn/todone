import { writable } from 'svelte/store';

type Action = {
	label: string;
	callback: () => void;
};

const createToastStore = () => {
	const { update, subscribe, set } = writable<{
		message: string | null;
		actions: Action[] | null;
	}>({
		message: null,
		actions: null
	});

	const setMessage = (message: string, actions: Action[] | null = null) => {
		update((store) => {
			store.message = message;
			store.actions = actions;
			return store;
		});
	};

	const clearMessage = () => {
		set({ message: null, actions: null });
	};

	return {
		subscribe,
		setMessage,
		clearMessage
	};
};

const toastStore = createToastStore();
export default toastStore;
