import { writable, type Writable } from 'svelte/store';

export enum SyncStatus {
	NOT_SYNCED = 'NOT_SYNCED',
	ACTIVE = 'ACTIVE',
	ERROR = 'ERROR'
}

export const status: Writable<SyncStatus> = writable(SyncStatus.NOT_SYNCED);

export const isLoggedin = writable(false);

export const user: Writable<{ name?: string }> = writable({});
export const token = writable('');
