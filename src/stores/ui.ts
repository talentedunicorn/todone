import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type Action = {
	label: string;
	callback: () => void;
};

/** Current view: 'kanban' | 'archive' */
export const currentView: Writable<string> = writable<string>('kanban');

/** Backward-compat alias for views that still use currentTab */
export const currentTab: Writable<string> = currentView;

export const toastMessage: Writable<string | null> = writable<string | null>(null);

export const toastActions: Writable<Action[] | null> = writable<Action[] | null>(null);
