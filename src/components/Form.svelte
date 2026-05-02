<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import DOMPurify from 'isomorphic-dompurify';
	import { component } from '@cartamd/plugin-component';
	import { svelte, initializeComponents } from '@cartamd/plugin-component/svelte';
	import { onMount, tick } from 'svelte';
	import SimpleImage from './SimpleImage.svelte';
	import IconH2 from './IconH2.svelte';
	import IconH3 from './IconH3.svelte';
	import IconTable from './IconTable.svelte';
	import IconImage from './IconImage.svelte';
	import Button from './Button.svelte';
	import type { Todo } from '../db';

	type Content = { title: string; value: string };

	interface Props {
		defaultValue?: Todo | null;
		enableEditor?: boolean;
		onClear: () => void;
		onUpdate: (data: Todo) => Promise<void> | void;
		onSubmit: (data: Todo) => Promise<void> | void;
	}

	let { defaultValue, enableEditor = true, onClear, onSubmit, onUpdate }: Props = $props();

	let carta = $state<any>(null);
	let isBrowser = $state(false);

	const buildCarta = () => {
		const mapped = [svelte('img', SimpleImage)];
		return new Carta({
			sanitizer: DOMPurify.sanitize,
			disableIcons: ['heading'],
			extensions: [
				component(mapped, initializeComponents),
				{
					icons: [
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
					]
				}
			]
		});
	};

	onMount(() => {
		if (typeof window === 'undefined' || !enableEditor) return;

		const initializeEditor = async () => {
			await tick();
			isBrowser = true;
			carta = buildCarta();
		};

		void initializeEditor();
	});

	let titleInput: HTMLInputElement;

	let data = $state<Todo | Content>({ title: '', value: '' });

	$effect(() => {
		if (defaultValue) {
			data = defaultValue;
		}
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

	const submit = async () => {
		if (isEdit) {
			await onUpdate(data as Todo);
		} else {
			await onSubmit(data as Todo);
		}
		clear();
	};

	$effect(() => {
		if (isEdit && titleInput) {
			window.scrollTo({ top: titleInput.scrollHeight });
			titleInput.focus();
		}
	});
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
	<div class="editor-wrapper">
		{#if isBrowser && carta}
			{#key carta}
				<MarkdownEditor
					{carta}
					bind:value={data.value}
					userLabels={{
						iconsLabels: {
							heading: 'Heading'
						}
					}}
				/>
			{/key}
		{/if}
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
		}

		.editor-wrapper {
			width: 100%;
			border-radius: 1rem;
			border: 0.2em solid var(--black);
			overflow: hidden;
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
	}

	:global(.carta-editor) {
		background-color: var(--white) !important;
		color: var(--black) !important;
		border: none !important;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	:global(.carta-toolbar) {
		background-color: var(--white) !important;
		color: var(--black) !important;
		border: none !important;
		border-bottom: 0.1em solid var(--gray-light) !important;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	:global(.carta-toolbar button) {
		color: var(--black) !important;
		background: transparent !important;
		border: none !important;
		cursor: pointer;
		padding: 0.5rem !important;
		font-size: 1rem !important;
		font-family: inherit !important;

		&:hover {
			background-color: var(--gray-light) !important;
		}
	}

	:global(.carta-icon) {
		width: 2rem !important;
		height: 2rem !important;
	}

	:global(.carta-editor textarea) {
		background-color: var(--white) !important;
		color: var(--black) !important;
		caret-color: var(--black) !important;
		border: none !important;
		font-size: 1rem !important;
		line-height: 1.7 !important;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	:global(.carta-font-code) {
		font-family: monospace !important;
		font-size: 1rem !important;
		line-height: 1.7 !important;
	}

	:global(.carta-editor code) {
		background: transparent !important;
		border: none !important;
		padding: 0 !important;
		font-size: inherit !important;
		display: inline !important;
	}

	:global(.carta-icons-menu) {
		background: var(--white) !important;
		color: var(--black) !important;
	}

	:global(.carta-icons-menu button) {
		color: var(--black) !important;
	}
</style>
