import { Carta } from 'carta-md';
import DOMPurify from 'isomorphic-dompurify';
import { code } from '@cartamd/plugin-code';
import { writable, get } from 'svelte/store';
import IconH2 from '../components/IconH2.svelte';
import IconH3 from '../components/IconH3.svelte';
import IconTable from '../components/IconTable.svelte';
import IconImage from '../components/IconImage.svelte';

export type CodeTheme = 'github-light' | 'github-dark';

interface ViewerOptions {
	theme?: CodeTheme;
	plugins?: any[];
	sanitizer?: any;
	enableCodeHighlighting?: boolean;
}

interface EditorOptions {
	enableCodeHighlighting?: boolean;
	customIcons?: any[];
	plugins?: any[];
	sanitizer?: any;
}

export const resolveCodeTheme = (): CodeTheme => {
	if (typeof window === 'undefined') return 'github-light';
	const configuredTheme = document.documentElement.dataset.theme;
	if (configuredTheme === 'dark') return 'github-dark';
	if (configuredTheme === 'light') return 'github-light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'github-dark' : 'github-light';
};

export function createViewerCarta(options: ViewerOptions = {}) {
	const theme = options.theme ?? resolveCodeTheme();
	const sanitizer = options.sanitizer ?? DOMPurify.sanitize;

	const extensions: any[] = [];
	if (options.enableCodeHighlighting !== false) {
		extensions.push(code({ theme }));
	}
	if (options.plugins) {
		extensions.push(...options.plugins);
	}

	return new Carta({
		sanitizer,
		extensions,
		shikiOptions: {
			themes: ['github-light', 'github-dark']
		}
	});
}

export function createEditorCarta(options: EditorOptions = {}) {
	const sanitizer = options.sanitizer ?? DOMPurify.sanitize;

	const defaultIcons = [
		{
			id: 'h2',
			action: (input: any) => input.toggleLinePrefix('## '),
			component: IconH2,
			label: 'Heading 2'
		},
		{
			id: 'h3',
			action: (input: any) => input.toggleLinePrefix('### '),
			component: IconH3,
			label: 'Heading 3'
		},
		{
			id: 'table',
			action: (input: any) => {
				const table = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
				const selection = input.getSelection();
				input.insertAt(selection.start, table);
				input.textarea.setSelectionRange(selection.start + 12, selection.start + 18);
			},
			component: IconTable,
			label: 'Insert Table'
		},
		{
			id: 'image',
			action: (input: any) => {
				const selection = input.getSelection();
				const imageMarkdown = '![Alt text](image-url)';
				let insertText: string;
				let cursorPos: number;

				if (selection.slice) {
					insertText = `![${selection.slice}](image-url)`;
					cursorPos = selection.start + insertText.length;
				} else {
					insertText = imageMarkdown;
					cursorPos = selection.start + 2;
				}

				input.insertAt(selection.start, insertText);
				input.textarea.setSelectionRange(cursorPos, cursorPos);
			},
			component: IconImage,
			label: 'Insert Image'
		}
	];

	const extensions: any[] = [
		{
			icons: options.customIcons ?? defaultIcons
		}
	];

	if (options.enableCodeHighlighting) {
		extensions.push(code({ theme: resolveCodeTheme() }));
	}

	if (options.plugins) {
		extensions.push(...options.plugins);
	}

	return new Carta({
		sanitizer,
		disableIcons: ['heading'],
		extensions
	});
}

export function setupThemeAwareViewer(options: ViewerOptions = {}) {
	if (typeof window === 'undefined') {
		return {
			carta: createViewerCarta({
				...options,
				theme: resolveCodeTheme(),
				enableCodeHighlighting: true
			}),
			cartaStore: writable(null as any),
			destroy: () => {}
		};
	}

	let currentTheme = resolveCodeTheme();
	let carta = createViewerCarta({ ...options, theme: currentTheme, enableCodeHighlighting: true });

	const store = writable(carta);

	const observer = new MutationObserver(() => {
		const nextTheme = resolveCodeTheme();
		if (nextTheme !== currentTheme) {
			currentTheme = nextTheme;
			carta = createViewerCarta({ ...options, theme: currentTheme, enableCodeHighlighting: true });
			store.set(carta);
		}
	});

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme']
	});

	return {
		carta,
		cartaStore: store,
		destroy: () => observer.disconnect()
	};
}
