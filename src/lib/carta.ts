import { Carta, type Plugin, type Icon } from 'carta-md';
import DOMPurify from 'isomorphic-dompurify';
import { code } from '@cartamd/plugin-code';
import IconH2 from '../components/IconH2.svelte';
import IconH3 from '../components/IconH3.svelte';
import IconTable from '../components/IconTable.svelte';
import IconImage from '../components/IconImage.svelte';

export type CodeTheme = 'github-light' | 'github-dark';

export interface ViewerOptions {
	theme?: CodeTheme;
	plugins?: Plugin[];
	sanitizer?: (dirty: string) => string;
	enableCodeHighlighting?: boolean;
}

export interface EditorOptions {
	enableCodeHighlighting?: boolean;
	customIcons?: Icon[];
	plugins?: Plugin[];
	sanitizer?: (dirty: string) => string;
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

	const extensions: Plugin[] = [];
	if (options.enableCodeHighlighting !== false) {
		extensions.push(code({ theme }) as Plugin);
	}
	if (options.plugins) {
		extensions.push(...options.plugins);
	}

	return new Carta({
		sanitizer,
		extensions: extensions as any,
		shikiOptions: {
			themes: ['github-light', 'github-dark']
		}
	});
}

interface IconActionInput {
	toggleLinePrefix(prefix: string): void;
	getSelection(): { start: number; end: number; slice?: string };
	insertAt(position: number, text: string): void;
	textarea: HTMLTextAreaElement;
}

type IconAction = (input: IconActionInput) => void;

export function createEditorCarta(options: EditorOptions = {}) {
	const sanitizer = options.sanitizer ?? DOMPurify.sanitize;

	const defaultIcons: Icon[] = [
		{
			id: 'h2',
			action: ((input: IconActionInput) => input.toggleLinePrefix('## ')) as IconAction,
			component: IconH2,
			label: 'Heading 2'
		},
		{
			id: 'h3',
			action: ((input: IconActionInput) => input.toggleLinePrefix('### ')) as IconAction,
			component: IconH3,
			label: 'Heading 3'
		},
		{
			id: 'table',
			action: ((input: IconActionInput) => {
				const table = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
				const selection = input.getSelection();
				input.insertAt(selection.start, table);
				input.textarea.setSelectionRange(selection.start + 12, selection.start + 18);
			}) as IconAction,
			component: IconTable,
			label: 'Insert Table'
		},
		{
			id: 'image',
			action: ((input: IconActionInput) => {
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
			}) as IconAction,
			component: IconImage,
			label: 'Insert Image'
		}
	];

	const extensions: Plugin[] = [
		{
			icons: options.customIcons ?? defaultIcons
		} as Plugin
	];

	if (options.enableCodeHighlighting) {
		extensions.push(code({ theme: resolveCodeTheme() }) as Plugin);
	}

	if (options.plugins) {
		extensions.push(...options.plugins);
	}

	return new Carta({
		sanitizer,
		disableIcons: ['heading'],
		extensions: extensions as any
	});
}
