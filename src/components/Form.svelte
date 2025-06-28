<script lang="ts">
	import Button from './Button.svelte';
	import { preventDefault } from '../lib/helpers';
	import type { Todo } from '../lib/pouchdb';

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

	let isEdit = $derived(defaultValue !== null);

	let isEmpty = $derived(data.value.trim().length < 1);

	let invalid = $derived(data.title.trim().length < 1 || isEmpty);
	let buttonText = $derived(isEdit ? 'Update' : 'Submit');

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
	<textarea data-testid="content" data-empty={isEmpty} bind:value={data.value}></textarea>
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
			flex: 100%;
			font-size: 1.5rem;
			font-weight: bold;
			font-family: inherit;
			overflow-x: auto;
		}

		textarea {
			flex: var(--textarea-width);
			font-size: 1rem;
			line-height: 1.5rem;
			font-family: monospace;
			resize: vertical;

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
