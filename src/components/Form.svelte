<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Button from './Button.svelte';
	import Tiptap from './Tiptap.svelte';

	const dispatch = createEventDispatcher();
	type Content = { title: string; value: string };

	export let defaultValue: Content | null = null;

	let titleInput: HTMLInputElement;
	let showMarkdown = true;
	let editor: Tiptap;

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
		editor.clear();
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
	{#if showMarkdown}
		<div class="ContentWrapper">
			<nav>
				<Button on:click={() => (showMarkdown = false)}>Visual mode</Button>
			</nav>
			<textarea rows={10} data-testid="content" bind:value={data.value}></textarea>
		</div>
	{:else}
		<Tiptap
			bind:this={editor}
			editorValue={data.value}
			on:change={(e) => (data.value = e.detail)}
			on:showMarkdown={() => (showMarkdown = true)}
		/>
	{/if}
	<footer class="Actions">
		<Button data-testid="cancel" on:click={clear} disabled={invalid}>Cancel</Button>
		<Button data-testid="submit" type="submit" variant="primary" disabled={invalid}
			>{buttonText}</Button
		>
	</footer>
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
		border: none;
	}

	input,
	textarea,
	:global(.tiptap) {
		background: var(--white);
		border-radius: 0.3em;
		padding: 0.5em;
	}

	textarea {
		border: none;
		field-sizing: content;
		resize: vertical;
		font-family: inherit;
		font-size: inherit;
	}

	.ContentWrapper {
		display: grid;
		gap: 1rem;
	}

	nav {
		display: flex;
	}
</style>
