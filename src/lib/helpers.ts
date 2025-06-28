import type { Todo } from './pouchdb';

export function preventDefault(fn: Function) {
	return (event: Event) => {
		event.preventDefault();
		fn.call(event);
	};
}

// Wait is time in ms - default to 500ms
export function throttle(callback: Function, wait = 500) {
	let timeoutRef: ReturnType<typeof setTimeout>;

	return (...args: any[]) => {
		clearTimeout(timeoutRef);
		timeoutRef = setTimeout(() => callback(...args), wait);
	};
}

export function title(title?: string) {
	return `${title ? title : 'ToDone'} — Get it done!`;
}

export const sortTodoByDateDesc = (a: Todo, b: Todo) =>
	new Date(b.updated).getTime() - new Date(a.updated).getTime();
