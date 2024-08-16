<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import { Carta, MarkdownEditor } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { slash } from '@cartamd/plugin-slash';
	import { code } from '@cartamd/plugin-code';
	import 'carta-md/default.css';
	import '@cartamd/plugin-slash/default.css';

	const carta = new Carta({
		sanitizer: false,
		extensions: [emoji(), slash(), code()]
	});

	const dispatch = createEventDispatcher();
	type Content = { title: string; value: string };

	export let defaultValue: Content | null = null;

	let titleInput: HTMLInputElement;

	$: data = defaultValue || {
		title: '',
		value: ''
	};

	$: isEdit = defaultValue !== null;

	$: if (isEdit && titleInput) {
		window.scrollTo({ top: titleInput.scrollHeight });
		titleInput.focus();
	}

	$: invalid = data.title.trim().length < 1 || data.value.trim().length < 1;
	$: buttonText = isEdit ? 'Update' : 'Submit';

	const clear = () => {
		defaultValue = null;
		data = { title: '', value: '' };
		dispatch('clear');
	};

	const submit = () => {
		isEdit ? dispatch('update', data) : dispatch('submit', data);
		clear();
	};
</script>

<!--
@component 
### Form.svelte

Form component with a title and content inputs

#### Example
```svelte
<Form
	defaultValue={Content}
	on:submit={}
	on:update={}
	on:clear={}
/>
```
-->
<form on:submit|preventDefault={submit}>
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
	<MarkdownEditor
		bind:value={data.value}
		mode="tabs"
		textarea={{ 'data-testid': 'content' }}
		{carta}
	/>
	<div class="Actions">
		<Button data-testid="cancel" on:click={clear} disabled={invalid}>Cancel</Button>
		<Button data-testid="submit" type="submit" variant="primary" disabled={invalid}
			>{buttonText}</Button
		>
	</div>
</form>

<style>
	form,
	.Actions {
		display: flex;
	}

	form {
		flex-flow: column;
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.5em;
		background-color: var(--gray-light);
	}

	.Actions {
		justify-content: space-between;
	}

	input {
		font-size: 1.5rem;
		font-weight: bold;
		font-family: inherit;
		border: none;
		padding: 0.5em;
	}

	input,
	:global(.carta-wrapper) {
		background: var(--white);
		border-radius: 0.3em;
	}

	:global(.carta-theme__default .carta-input, .carta-theme__default .carta-renderer) {
		height: auto;
		overflow-y: auto;
	}

	:global(.carta-font-code),
	:global(.carta-font-code *) {
		font-size: 1rem;
		line-height: 1.5rem;
	}

	:global(.carta-renderer > *:first-child) {
		margin-top: 0;
	}

	:global(.carta-icons-menu) {
		background: var(--gray-light);
	}
</style>
