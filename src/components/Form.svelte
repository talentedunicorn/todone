<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import DOMPurify from 'isomorphic-dompurify';
	import { code } from '@cartamd/plugin-code';
	import { component } from '@cartamd/plugin-component';
	import { svelte, initializeComponents } from '@cartamd/plugin-component/svelte';
	import SimpleImage from './SimpleImage.svelte';
	import IconH2 from './IconH2.svelte';
	import IconH3 from './IconH3.svelte';
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

	let carta = $state<any>(null);
	let isBrowser = $state(false);

	$effect(() => {
		if (typeof window !== 'undefined' && !isBrowser) {
			isBrowser = true;
			const mapped = [svelte('img', SimpleImage)];

			carta = new Carta({
				sanitizer: DOMPurify.sanitize,
				disableIcons: ['heading'],
				extensions: [
					code({
						theme: {
							light: 'github-light',
							dark: 'github-dark'
						}
					}),
					component(mapped, initializeComponents),
					{
						icons: [
							{
								id: 'h2',
								action: (input: any) => input.toggleLinePrefix('## '),
								component: IconH2
							},
							{
								id: 'h3',
								action: (input: any) => input.toggleLinePrefix('### '),
								component: IconH3
							}
						]
					}
				],
				shikiOptions: {
					themes: ['github-light', 'github-dark']
				}
			});
		}
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

	const submit = () => {
		isEdit ? onUpdate(data as Todo) : onSubmit(data as Todo);
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
			<MarkdownEditor {carta} bind:value={data.value} />
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
</style>
