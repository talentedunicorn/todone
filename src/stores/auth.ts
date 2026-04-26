import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const isLoggedin = writable(false);

export const user = writable<{ name?: string; nickname?: string; picture?: string }>({});

export const token: Writable<string | null | undefined> = writable<string | null | undefined>(
	undefined
);
