import { resolveCodeTheme, type CodeTheme } from './carta';
import type { Carta } from 'carta-md';
import { tick } from 'svelte';

export function themeObserver<T extends Carta | null>(
	node: HTMLElement,
	options: {
		createInstance: (theme: CodeTheme) => T;
		onUpdate: (instance: T) => void;
	}
) {
	const update = () => {
		options.onUpdate(null as T);
		requestAnimationFrame(() => {
			const newInstance = options.createInstance(resolveCodeTheme());
			options.onUpdate(newInstance);
		});
	};

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.attributeName === 'data-theme') {
				tick().then(update);
			}
		}
	});

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme']
	});

	update();

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
