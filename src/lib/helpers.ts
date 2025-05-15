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
