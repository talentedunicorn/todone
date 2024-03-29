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
		placeholder="Title"
		bind:value={data.title}
		bind:this={titleInput}
	/>
	<label class="visually-hidden" for="content">Content</label>
	<textarea id="content" rows="5" placeholder="Start typing something..." bind:value={data.value} />
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
		font-size: 1rem;
		font-family: inherit;
		border: none;
		border-radius: 0.3em;
		padding: 0.5em;
	}

	input {
		font-size: 1.2rem;
	}

	textarea {
		resize: vertical;
	}
</style>
