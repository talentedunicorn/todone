<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
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

	let carta: any = $state(null);
	let isBrowser = $state(false);
	let MarkdownEditor: any = $state(null);
	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});

	$effect(() => {
		if (mounted && typeof window !== 'undefined' && !isBrowser) {
			isBrowser = true;
			Promise.all([import('carta-md'), import('carta-md/default.css')]).then(
				([{ Carta, MarkdownEditor: ME }, _]) => {
					carta = new Carta({
						sanitizer: DOMPurify.sanitize
					});
					MarkdownEditor = ME;
				}
			);
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
		{#if isBrowser && carta && MarkdownEditor}
			<MarkdownEditor {carta} bind:value={data.value} />
		{:else}
			<textarea
				class="fallback-editor"
				bind:value={data.value}
				placeholder="Write your markdown here..."
			></textarea>
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

			@media (width > 48rem) {
				position: sticky;
				bottom: 1rem;
			}
		}

		.editor-wrapper {
			width: 100%;
			border-radius: 1rem;
			border: 0.2em solid var(--black);
			overflow: hidden;
		}

		.fallback-editor {
			width: 100%;
			min-height: 50vh;
			padding: 1rem;
			font-size: 1rem;
			line-height: 1.7;
			font-family: monospace;
			border: none;
			resize: none;
			background: var(--white);
			border-radius: 1rem;
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
</style>
