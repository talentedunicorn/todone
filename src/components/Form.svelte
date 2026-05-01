<script lang="ts">
	import hljs from 'highlight.js';
	import Button from './Button.svelte';
	import type { Todo } from '../db';

	type Content = { title: string; value: string };

	interface Props {
		defaultValue?: Todo | null;
		onClear: () => void;
		onUpdate: (data: Todo) => void;
		onSubmit: (data: Todo) => void;
	}

	let { defaultValue, onClear, onSubmit, onUpdate }: Props = $props();

	// Lightweight WYSIWYG toolbar helpers (minimal MVP)
	const wrapSelection = (startToken: string, endToken?: string) => {
		const ta = document.getElementById('content') as HTMLTextAreaElement | null;
		if (!ta) return;
		const s = ta.selectionStart;
		const e = ta.selectionEnd;
		const value = ta.value;
		const sel = value.substring(s, e);
		const inner = sel.length > 0 ? sel : 'text';
		const newValue =
			value.substring(0, s) + startToken + inner + (endToken ?? '') + value.substring(e);
		// Update data and caret position
		data = { ...(data as any), value: newValue } as any;
		const caret = s + startToken.length + inner.length + (endToken ? endToken.length : 0);
		requestAnimationFrame(() => {
			ta.focus();
			ta.setSelectionRange(caret, caret);
		});
	};

	const prefixLines = (prefix: string, insertNewLine = false) => {
		const ta = document.getElementById('content') as HTMLTextAreaElement | null;
		if (!ta) return;
		const s = ta.selectionStart;
		const e = ta.selectionEnd;
		const value = ta.value;
		const lines = value.split('\n');
		const startLine = value.substring(0, s).split('\n').length - 1;
		const endLine = value.substring(0, e).split('\n').length - 1;
		for (let i = startLine; i <= endLine; i++) {
			lines[i] = lines[i] || '' ? prefix + lines[i] : prefix + '';
		}
		let newValue = lines.join('\n');
		if (insertNewLine) {
			newValue += '\n';
		}
		data = { ...(data as any), value: newValue } as any;
		const caret = value.substring(0, s).length + prefix.length + (insertNewLine ? 1 : 0);
		requestAnimationFrame(() => {
			ta.focus();
			ta.setSelectionRange(caret, caret);
		});
	};

	const insertCodeBlock = () => {
		const ta = document.getElementById('content') as HTMLTextAreaElement | null;
		if (!ta) return;
		const s = ta.selectionStart;
		const e = ta.selectionEnd;
		const value = ta.value;
		const sel = value.substring(s, e);
		const inner = sel.length > 0 ? sel : 'code';
		const block = '```markdown\n' + inner + '\n```';
		const newValue = value.substring(0, s) + block + value.substring(e);
		data = { ...(data as any), value: newValue } as any;
		const caret = s + '```markdown\n'.length;
		requestAnimationFrame(() => {
			ta.focus();
			ta.setSelectionRange(caret, caret);
		});
	};

	const insertHeading = () => {
		const ta = document.getElementById('content') as HTMLTextAreaElement | null;
		if (!ta) return;
		const value = ta.value;
		const s = ta.selectionStart;
		const e = ta.selectionEnd;
		const startLine = value.substring(0, s).split('\n').length - 1;
		const endLine = value.substring(0, e).split('\n').length - 1;
		const lines = value.split('\n');
		const prefix = '## ';
		for (let i = startLine; i <= endLine; i++) {
			lines[i] = prefix + (lines[i] ?? '');
		}
		const newValue = lines.join('\n');
		data = { ...(data as any), value: newValue } as any;
		const caret = value.substring(0, s).length + prefix.length;
		requestAnimationFrame(() => {
			ta.focus();
			ta.setSelectionRange(caret, caret);
		});
	};

	let activeListPrefix = $state('');
	let activeListIndent = $state('');

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && activeListPrefix) {
			const ta = document.getElementById('content') as HTMLTextAreaElement | null;
			if (!ta) return;
			const s = ta.selectionStart;
			const value = ta.value;
			const lineStart = value.lastIndexOf('\n', s - 1) + 1;
			const currentLine = value.substring(lineStart, s);
			const isEmptyListItem =
				currentLine.replace(activeListIndent, '').replace(activeListPrefix, '').trim() === '';
			if (isEmptyListItem) {
				activeListPrefix = '';
				activeListIndent = '';
				return;
			}
			e.preventDefault();
			const newValue =
				value.substring(0, s) + '\n' + activeListIndent + activeListPrefix + value.substring(s);
			data = { ...(data as any), value: newValue } as any;
			const caret = s + 1 + activeListIndent.length + activeListPrefix.length;
			requestAnimationFrame(() => {
				ta.focus();
				ta.setSelectionRange(caret, caret);
			});
		}
	};

	const checkActiveList = () => {
		const ta = document.getElementById('content') as HTMLTextAreaElement | null;
		if (!ta) {
			activeListPrefix = '';
			activeListIndent = '';
			return;
		}
		const value = ta.value;
		const cursorPos = ta.selectionStart;
		const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
		const currentLine = value.substring(lineStart, cursorPos);
		const indentMatch = currentLine.match(/^(\s*)/);
		const indent = indentMatch ? indentMatch[1] : '';
		if (currentLine.match(/^(\s*)(\d+\. |[-*] |- \[ \])/)) {
			activeListIndent = indent;
			if (currentLine.match(/^\s*\d+\. /)) {
				const num = currentLine.match(/^\s*(\d+)\. /)?.[1];
				activeListPrefix = `${parseInt(num || '1') + 1}. `;
			} else if (currentLine.match(/^\s*- \[ \]/)) {
				activeListPrefix = '- [ ] ';
			} else if (currentLine.match(/^\s*- \[x\] /)) {
				activeListPrefix = '- [ ] ';
			} else if (currentLine.match(/^\s*[-*] /)) {
				const bullet = currentLine.match(/^\s*([-*]) /)?.[1];
				activeListPrefix = `${bullet} `;
			} else {
				activeListPrefix = '- ';
			}
		} else {
			activeListPrefix = '';
			activeListIndent = '';
		}
	};

	let titleInput: HTMLInputElement;

	let data = $state<Todo | Content>({
		title: '',
		value: ''
	});

	const isEdit = $derived(defaultValue !== null);

	const isEmpty = $derived(data.value.trim().length < 1);

	const invalid = $derived(data.title.trim().length < 1 || isEmpty);
	const buttonText = $derived(isEdit ? 'Update' : 'Submit');

	const clear = () => {
		defaultValue = null;
		data = { title: '', value: '' };
		onClear();
	};

	const submit = () => {
		isEdit ? onUpdate(data as Todo) : onSubmit(data as Todo);
		clear();
	};

	$effect(() => {
		if (isEdit && titleInput) {
			window.scrollTo({ top: titleInput.scrollHeight });
			titleInput.focus();
		}

		if (defaultValue) {
			data = defaultValue;
		}
	});

	const higlighted = $derived(hljs.highlight(data.value, { language: 'markdown' }).value);
</script>

<!--
@component 
### Form.svelte

Form component with a title and content inputs

#### Example
```svelte
<Form
	defaultValue={Content}
	onSubmit={}
	onUpdate={}
	onClear={}
/>
```
-->
<form
	onsubmit={(e) => {
		e.preventDefault();
		submit();
	}}
>
	<label class="visually-hidden" for="title">Title</label>
	<input
		type="text"
		id="title"
		data-testid="title"
		placeholder="Start something..."
		bind:value={data.title}
		bind:this={titleInput}
	/>
	<label class="visually-hidden" for="content">Content</label>
	<!-- MVP WYSIWYG Toolbar: icon buttons above content -->
	<div class="WysiwygToolbar" aria-label="Markdown toolbar" role="toolbar">
		<Button
			data-testid="toolbar-bold"
			size="small"
			onclick={() => wrapSelection('**', '**')}
			aria-label="Bold"
			title="Bold"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2.5"
				><g
					><path
						d="M5 6c0-1.414 0-2.121.44-2.56C5.878 3 6.585 3 8 3h4.579C15.02 3 17 5.015 17 7.5S15.02 12 12.579 12H5z"
						clip-rule="evenodd"
					/><path
						d="M12.429 12h1.238C16.06 12 18 14.015 18 16.5S16.06 21 13.667 21H8c-1.414 0-2.121 0-2.56-.44C5 20.122 5 19.415 5 18v-6"
					/></g
				></svg
			>
		</Button>
		<Button
			data-testid="toolbar-italic"
			size="small"
			onclick={() => wrapSelection('*', '*')}
			aria-label="Italic"
			title="Italic"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-width="2.5"><path d="M12 4h7M8 20l8-16M5 20h7" /></svg
			>
		</Button>
		<Button
			data-testid="toolbar-heading"
			size="small"
			onclick={() => insertHeading()}
			aria-label="Heading"
			title="Heading"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2.5"
				><path
					d="M3.5 5v14m10-14v14m7 0h-4v-.31c0-.438 0-.657.087-.852c.086-.194.249-.34.575-.634l2.605-2.344c.467-.42.733-1.018.733-1.646V13a2 2 0 1 0-4 0v.4M3.5 12h10"
				/></svg
			>
		</Button>
		<Button
			data-testid="toolbar-code"
			size="small"
			onclick={() => wrapSelection('`', '`')}
			aria-label="Inline Code"
			title="Inline Code"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2.5"
				><path
					d="m16 7l3.066 2.643C20.356 10.754 21 11.31 21 12s-.645 1.246-1.934 2.357L16 17M8 7L4.934 9.643C3.644 10.754 3 11.31 3 12s.645 1.246 1.934 2.357L8 17"
				/></svg
			>
		</Button>
		<Button
			data-testid="toolbar-codeblock"
			size="small"
			onclick={() => insertCodeBlock()}
			aria-label="Code Block"
			title="Code Block"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				><g stroke-linecap="round" stroke-linejoin="round"
					><path
						d="m16 10l1.227 1.057c.515.445.773.667.773.943s-.258.498-.773.943L16 14m-8-4l-1.227 1.057C6.258 11.502 6 11.724 6 12s.258.498.773.943L8 14m5-5l-2 6"
					/></g
				><path
					d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"
				/></svg
			>
		</Button>
		<Button
			data-testid="toolbar-ul"
			size="small"
			onclick={() => prefixLines('- ', false)}
			aria-label="Bulleted List"
			title="Bulleted List"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-width="2.5"
				><g
					><path d="M8 5.5h12m-12 7h12m-12 7h12" /><path
						stroke-linejoin="round"
						d="M4.375 5.5H4.25m.25 0a.25.25 0 1 1-.5 0a.25.25 0 0 1 .5 0m-.125 7H4.25m.25 0a.25.25 0 1 1-.5 0a.25.25 0 0 1 .5 0m-.125 7H4.25m.25 0a.25.25 0 1 1-.5 0a.25.25 0 0 1 .5 0"
					/></g
				></svg
			>
		</Button>
		<Button
			data-testid="toolbar-ol"
			size="small"
			onclick={() => prefixLines('1. ', false)}
			aria-label="Numbered List"
			title="Numbered List"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-width="2.5"
				><g
					><path d="M11 6h10m-10 6h10m-10 6h10" /><path
						stroke-linejoin="round"
						d="M3 15h1.5c.279 0 .418 0 .534.023a1.2 1.2 0 0 1 .943.943C6 16.082 6 16.22 6 16.5s0 .418-.023.534a1.2 1.2 0 0 1-.943.943C4.918 18 4.78 18 4.5 18s-.418 0-.534.023a1.2 1.2 0 0 0-.943.943C3 19.082 3 19.22 3 19.5v.9c0 .283 0 .424.088.512s.23.088.512.088H6M3 3h1.2a.3.3 0 0 1 .3.3V9m0 0H3m1.5 0H6"
					/></g
				></svg
			>
		</Button>
		<Button
			data-testid="toolbar-check"
			size="small"
			onclick={() => prefixLines('- [ ] ', false)}
			aria-label="Checklist"
			title="Checklist"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-width="2.5"
				><path d="M11 6h10m-10 6h10m-10 6h10" /><path
					stroke-linejoin="round"
					d="M3 7.393S4 8.045 4.5 9C4.5 9 6 5.25 8 4M3 18.393S4 19.045 4.5 20c0 0 1.5-3.75 3.5-5"
				/></svg
			>
		</Button>
		<Button
			data-testid="toolbar-link"
			size="small"
			onclick={() => wrapSelection('[', '](url)')}
			aria-label="Link"
			title="Link"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-width="2.5"
				><g
					><path
						d="m9.143 10.691l.207-.207a5.067 5.067 0 1 1 7.166 7.166l-2.866 2.866a5.067 5.067 0 1 1-7.166-7.166l.464-.464"
					/><path
						d="m17.052 11.114l.464-.464a5.067 5.067 0 1 0-7.166-7.166L7.484 6.35a5.067 5.067 0 1 0 7.166 7.166l.207-.207"
					/></g
				></svg
			>
		</Button>
	</div>
	<div class="content-wrapper">
		<textarea
			id="content"
			data-testid="content"
			data-empty={isEmpty}
			bind:value={data.value}
			onkeydown={handleKeydown}
			oninput={checkActiveList}
		></textarea>
		<pre class="overlay highlight language-markdown">{@html higlighted}</pre>
	</div>
	<div class="Actions">
		<Button data-testid="cancel" data-umami-event="Cancel edit" onclick={clear} disabled={invalid}
			>Cancel</Button
		>
		<Button
			data-testid="submit"
			data-umami-event="Save"
			type="submit"
			variant="primary"
			disabled={invalid}>{buttonText}</Button
		>
	</div>
</form>

<style>
	form {
		--textarea-width: 30rem;
		--textarea-height: 50vh;
		gap: 1rem;
		padding: 1rem;
		border-radius: 1rem;
		border: 0.2em solid var(--gray);

		&,
		& .Actions {
			display: flex;
			flex-wrap: wrap;
		}

		& .Actions {
			align-self: end;
			gap: 1rem;
			align-items: flex-end;
			justify-content: space-between;

			@media (width > 48rem) {
				position: sticky;
				bottom: 1rem;
			}
		}

		.WysiwygToolbar {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
			width: 100%;
			justify-content: flex-start;
			padding: 0.5rem 0;
		}

		.content-wrapper {
			position: relative;
			flex: var(--textarea-width);
			display: grid;

			& textarea,
			& :global(.overlay) {
				grid-area: 1/1/1/1;
				font-size: 1rem;
				line-height: 1.7;
				font-family: monospace;
				padding: 1rem;
				margin: 0;
				white-space: pre-wrap;
				word-break: break-word;
				width: 100%;
				overflow-x: auto;
				border-radius: 1rem;
				border: 0.2em solid var(--black);
			}
		}

		input {
			flex: 100%;
			font-size: 1.5rem;
			font-weight: bold;
			font-family: inherit;
			overflow-x: auto;

			border: none;
			background: var(--white);
			border-radius: 0.5rem;
			padding: 0.5em;
		}

		textarea {
			position: relative;
			z-index: 1;
			resize: none;
			width: 100%;
			height: 100%;
			color: transparent;
			background: transparent;
			caret-color: var(--black);
			border: none;

			&[data-empty='false'] {
				min-height: var(--textarea-height);
			}
		}

		@supports (field-sizing: content) {
			textarea {
				field-sizing: content;
				--textarea-height: auto;
			}
		}
	}
</style>
