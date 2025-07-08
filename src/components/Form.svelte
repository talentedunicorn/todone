<script lang="ts">
	import { createWysimark, type Wysimark } from '@wysimark/standalone';
	import Button from './Button.svelte';
	import { preventDefault } from '../lib/helpers';
	import type { Todo } from '../db';
	import { onMount } from 'svelte';

	type Content = { title: string; value: string };

	interface Props {
		defaultValue?: Todo | null;
		onClear: () => void;
		onUpdate: (data: Todo) => void;
		onSubmit: (data: Todo) => void;
	}

	let { defaultValue, onClear, onSubmit, onUpdate }: Props = $props();

	let titleInput: HTMLInputElement;
	let editor: HTMLDivElement;
	let wysimark: Wysimark;

	let data = $state<Todo | Content>(
		defaultValue || {
			title: '',
			value: ''
		}
	);

	let isEdit = $derived(defaultValue !== null);

	let isEmpty = $derived(data.value.trim().length < 1);

	let invalid = $derived(data.title.trim().length < 1 || isEmpty);
	let buttonText = $derived(isEdit ? 'Update' : 'Submit');

	const clear = () => {
		defaultValue = null;
		data = { title: '', value: '' };
		wysimark.setMarkdown('');
		onClear();
	};

	const submit = () => {
		isEdit ? onUpdate(data as Todo) : onSubmit(data as Todo);
		clear();
	};

	$effect(() => {
		if (isEdit && titleInput) {
			window.scrollTo({ top: titleInput.scrollHeight });
		}

		if (defaultValue) {
			data = defaultValue;
      wysimark?.setMarkdown(data.value)
		}
	});

	onMount(() => {
		wysimark = createWysimark(editor, {
			initialMarkdown: defaultValue?.value ?? '',
			onChange: (value) => {
				data.value = value;
			}
		});

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
<form onsubmit={preventDefault(submit)}>
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
	<div bind:this={editor} class="editor" data-testid="content"></div>
	<div class="Actions">
		<Button data-testid="cancel" onclick={clear} disabled={invalid}>Cancel</Button>
		<Button data-testid="submit" type="submit" variant="primary" disabled={invalid}
			>{buttonText}</Button
		>
	</div>
</form>

<style>
	form {
		--textarea-width: 20rem;
		--textarea-height: 50vh;
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.5em;
		background-color: var(--gray-light);

		&,
		& .Actions {
			display: flex;
			flex-wrap: wrap;
		}

		& .Actions {
			gap: 1rem;
			align-items: flex-end;
			justify-content: space-between;
		}
		input,
		textarea {
			border: none;
			background: var(--white);
			border-radius: 0.3em;
			padding: 0.5em;
		}

		input {
			width: 100%;
			font-size: 1.5rem;
			font-weight: bold;
			font-family: inherit;
			overflow-x: auto;
		}

		.editor {
			flex: var(--textarea-width);

			:global(:first-of-type) {
				color: var(--black);
			}

			:global(:first-of-type > :first-of-type) {
				background-color: inherit;
			}
		}
	}
</style>
