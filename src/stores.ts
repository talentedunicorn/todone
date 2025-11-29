import { writable } from 'svelte/store';

type TypeFrom<T> = T[keyof T];
type Action = {
	label: string;
	callback: () => void;
};

export const SyncStatus = {
	NOT_SYNCED: 'NOT_SYNCED',
	ACTIVE: 'ACTIVE',
	ERROR: 'ERROR'
} as const;

export const tabs = [{ label: 'To Do' }, { label: 'Done' }];

export const currentTab = writable<string>(tabs[0].label);

export const status = writable<TypeFrom<typeof SyncStatus>>(SyncStatus.NOT_SYNCED);

export const isLoggedin = writable(false);

export const user = writable<{ name?: string; nickname?: string; picture?: string }>({});
export const token = writable<string | null | undefined>(undefined);

export const toastMessage = writable<string | null>(null);
export const toastActions = writable<Action[] | null>(null);

const storedExpandedTasks = localStorage.getItem('expandedTasks');
export const expandedTasks = writable<Set<string>>(
	storedExpandedTasks ? new Set(JSON.parse(storedExpandedTasks)) : new Set()
);

expandedTasks.subscribe((set) => {
	localStorage.setItem('expandedTasks', JSON.stringify(Array.from(set)));
});
