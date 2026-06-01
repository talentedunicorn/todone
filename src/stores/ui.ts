import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type Action = {
	label: string;
	callback: () => void;
};

export const toastMessage: Writable<string | null> = writable<string | null>(null);

export const toastActions: Writable<Action[] | null> = writable<Action[] | null>(null);
