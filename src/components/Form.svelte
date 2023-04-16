<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher();

	export let defaultValue = null;

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

	function clear() {
		defaultValue = null;
		data = { title: '', value: '' };
		dispatch('clear');
	}

	function submit() {
		isEdit ? dispatch('update', data) : dispatch('submit', data);
		clear();
	}
</script>

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
		<Button on:click={clear} disabled={invalid}>Cancel</Button>
		<Button type="submit" variant="primary" disabled={invalid}>{buttonText}</Button>
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
