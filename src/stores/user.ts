import { writable } from 'svelte/store';

type TypeFrom<T> = T[keyof T];

export const SyncStatus = {
	NOT_SYNCED: 'NOT_SYNCED',
	ACTIVE: 'ACTIVE',
	ERROR: 'ERROR'
} as const;

type SyncStatuses = TypeFrom<typeof SyncStatus>;

type User = { name?: string; nickname?: string; picture?: string };

type UserStore = {
	isLoggedIn: boolean;
	syncStatus: SyncStatuses;
	token?: string;
	user: User;
};
const createUserStore = () => {
	const { subscribe, update } = writable<UserStore>({
		isLoggedIn: false,
		syncStatus: SyncStatus.NOT_SYNCED,
		user: {},
		token: undefined
	});

	const setStatus = (status: SyncStatuses) => {
		update((store) => {
			store.syncStatus = status;
			return store;
		});
	};

	const setToken = (token?: string) => {
		update((store) => {
			store.token = token;
			return store;
		});
	};

	const setUser = (user: User) => {
		update((store) => {
			store.user = user;
			return store;
		});
	};

	const setIsLoggedIn = (status: boolean) => {
		update((store) => {
			store.isLoggedIn = status;
			return store;
		});
	};

	return {
		subscribe,
		setStatus,
		setToken,
		setUser,
		setIsLoggedIn
	};
};

const userStore = createUserStore();

export default userStore;
