import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type SyncStatusValue = 'NOT_SYNCED' | 'ACTIVE' | 'ERROR';

export const SyncStatus = {
	NOT_SYNCED: 'NOT_SYNCED',
	ACTIVE: 'ACTIVE',
	ERROR: 'ERROR'
} as const satisfies Record<SyncStatusValue, SyncStatusValue>;

export type SyncStatus = SyncStatusValue;

export const status: Writable<SyncStatus> = writable<SyncStatus>(SyncStatus.NOT_SYNCED);
