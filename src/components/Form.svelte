<script lang="ts">
	import hljs from 'highlight.js';
	import Button from './Button.svelte';
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import type { Todo } from '../db';

	type Content = { title: string; value: string };

	interface Props {
		defaultValue?: Todo | null;
		onClear: () => void;
		onUpdate: (data: Todo) => void;
		onSubmit: (data: Todo) => void;
	}

	let { defaultValue, onClear, onSubmit, onUpdate }: Props = $props();

	const sanitize = (html: string) => html;
	const carta = new Carta({ sanitizer: sanitize });

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
	<div class="content-wrapper">
		<MarkdownEditor bind:value={data.value} {carta} />
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
			width: 100%;
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

		:global(.carta-editor) {
			width: 100%;
			min-height: var(--textarea-height);
		}

		:global(.carta-editor textarea) {
			font-size: 1rem;
			line-height: 1.7;
			font-family: monospace;
			padding: 1rem;
			border-radius: 1rem;
			border: 0.2em solid var(--black);
			width: 100%;
			resize: vertical;
		}

		:global(.carta-toolbar) {
			display: flex;
			flex-wrap: wrap;
			gap: 0.25rem;
			padding: 0.5rem;
			border: 0.2em solid var(--black);
			border-bottom: none;
			border-radius: 1rem 1rem 0 0;
			background: var(--white);
		}

		:global(.carta-toolbar button) {
			padding: 0.25rem 0.5rem;
			border: 0.1em solid var(--gray);
			border-radius: 0.3rem;
			background: var(--white);
			cursor: pointer;
			font-size: 0.9rem;
		}

		:global(.carta-toolbar button:hover) {
			background: var(--gray-light);
		}

		:global(.carta-preview) {
			display: none;
		}

		pre.overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			pointer-events: none;
			overflow: auto;
			white-space: pre-wrap;
			word-break: break-word;
			font-size: 1rem;
			line-height: 1.7;
			font-family: monospace;
			padding: 1rem;
			border-radius: 1rem;
			border: 0.2em solid var(--black);
			color: transparent;
			background: transparent;
		}

		:global(pre code.hljs) {
			color: transparent;
			background: transparent;
		}
	}
</style>
