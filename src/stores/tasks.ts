import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

const storedExpandedTasks = localStorage.getItem('expandedTasks');
export const expandedTasks: Writable<Set<string>> = writable<Set<string>>(
	storedExpandedTasks ? new Set(JSON.parse(storedExpandedTasks)) : new Set()
);

expandedTasks.subscribe((set) => {
	localStorage.setItem('expandedTasks', JSON.stringify(Array.from(set)));
});
