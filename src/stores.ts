import { writable } from 'svelte/store';

type Action = {
	label: string;
	callback: () => void;
};

export enum SyncStatus {
	NOT_SYNCED = 'NOT_SYNCED',
	ACTIVE = 'ACTIVE',
	ERROR = 'ERROR'
}
export const tabs = [{ label: 'To Do' }, { label: 'Done' }];

export const currentTab = writable<string>(tabs[0].label);

export const status = writable<SyncStatus>(SyncStatus.NOT_SYNCED);

export const isLoggedin = writable(false);

export const user = writable<{ name?: string }>({});
export const token = writable('');

export const toastMessage = writable<string | null>(null);
export const toastActions = writable<Action[] | null>(null);
