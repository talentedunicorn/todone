<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import { onMount, tick } from 'svelte';
	import Button from './Button.svelte';
	import { createEditorCarta } from '../lib/carta';
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

	let carta = $state<Carta | null>(null);
	let isBrowser = $state(false);

	const initializeEditor = async () => {
		await tick();
		isBrowser = true;
		carta = createEditorCarta({ enableCodeHighlighting: true });
	};

	onMount(() => {
		if (typeof window === 'undefined' || !enableEditor) return;

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

	:global(.carta-renderer, .carta-input) {
		max-height: 25rem; /* Sets a maximum height for the editor and input */
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
