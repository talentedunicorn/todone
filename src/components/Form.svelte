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
		const prefix = '# ';
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

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && activeListPrefix) {
			e.preventDefault();
			const ta = document.getElementById('content') as HTMLTextAreaElement | null;
			if (!ta) return;
			const s = ta.selectionStart;
			const value = ta.value;
			const newValue = value.substring(0, s) + '\n' + activeListPrefix + value.substring(s);
			data = { ...(data as any), value: newValue } as any;
			const caret = s + 1 + activeListPrefix.length;
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
			return;
		}
		const value = ta.value;
		const cursorPos = ta.selectionStart;
		const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
		const currentLine = value.substring(lineStart, cursorPos);
		if (currentLine.match(/^(\d+\. |- |- \[ \])/)) {
			if (currentLine.match(/^\d+\. /)) {
				const num = currentLine.match(/^(\d+)\. /)?.[1];
				activeListPrefix = `${parseInt(num || '1') + 1}. `;
			} else if (currentLine.match(/^- \[ \]/)) {
				activeListPrefix = '- [ ] ';
			} else if (currentLine.match(/^- \[x\] /)) {
				activeListPrefix = '- [ ] ';
			} else {
				activeListPrefix = currentLine.match(/^- /)?.[0] || '- ';
			}
		} else {
			activeListPrefix = '';
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
	<!-- MVP WYSIWYG Toolbar: emoji buttons above content -->
	<div class="WysiwygToolbar" aria-label="Markdown toolbar" role="toolbar">
		<Button data-testid="toolbar-bold" size="small" onclick={() => wrapSelection('**', '**')}
			>B</Button
		>
		<Button data-testid="toolbar-italic" size="small" onclick={() => wrapSelection('*', '*')}
			>I</Button
		>
		<Button data-testid="toolbar-heading" size="small" onclick={() => insertHeading()}>H</Button>
		<Button data-testid="toolbar-code" size="small" onclick={() => wrapSelection('`', '`')}
			>&lt;/&gt;</Button
		>
		<Button data-testid="toolbar-codeblock" size="small" onclick={() => insertCodeBlock()}
			>```</Button
		>
		<Button data-testid="toolbar-ul" size="small" onclick={() => prefixLines('- ', false)}>•</Button
		>
		<Button data-testid="toolbar-ol" size="small" onclick={() => prefixLines('1. ', false)}
			>1.</Button
		>
		<Button data-testid="toolbar-check" size="small" onclick={() => prefixLines('- [ ] ', false)}
			>☐</Button
		>
		<Button data-testid="toolbar-link" size="small" onclick={() => wrapSelection('[', '](url)')}
			>🔗</Button
		>
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
