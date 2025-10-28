<script lang="ts">
	import hljs from 'highlight.js';
	import Button from './Button.svelte';
	import { preventDefault } from '../lib/helpers';
	import type { Todo } from '../db';

	type Content = { title: string; value: string };

	interface Props {
		defaultValue?: Todo | null;
		onClear: () => void;
		onUpdate: (data: Todo) => void;
		onSubmit: (data: Todo) => void;
	}

	let { defaultValue, onClear, onSubmit, onUpdate }: Props = $props();

	let titleInput: HTMLInputElement;

	let data = $state<Todo | Content>(
		defaultValue || {
			title: '',
			value: ''
		}
	);

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
	<div class="content-wrapper">
		<textarea id="content" data-testid="content" data-empty={isEmpty} bind:value={data.value}
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
			position: sticky;
			bottom: 1rem;
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
