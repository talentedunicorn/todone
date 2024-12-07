export function preventDefault(fn: Function) {
	return (event: Event) => {
		event.preventDefault();
		fn.call(event);
	};
}
