<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

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

	$: isEmpty = data.value.trim().length < 1;

	$: invalid = data.title.trim().length < 1 || isEmpty;
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
	<textarea data-testid="content" data-empty={isEmpty} bind:value={data.value}></textarea>
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

	input,
	textarea {
		border: none;
		background: var(--white);
		border-radius: 0.3em;
		padding: 0.5em;
	}

	input {
		font-size: 1.5rem;
		font-weight: bold;
		font-family: inherit;
		overflow-x: auto;
	}

	textarea {
		font-size: 1rem;
		line-height: 1.5rem;
		font-family: monospace;
		resize: vertical;
	}

	textarea[data-empty='false'] {
		min-height: 50vh;
	}
</style>
