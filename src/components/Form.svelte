<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { gfm } from '@milkdown/preset-gfm';
	import { replaceAll } from '@milkdown/utils';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx } from '@milkdown/core';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher();
	type Content = { title: string; value: string };

	export let defaultValue: Content | null = null;

	let titleInput: HTMLInputElement;
	let editorRef: Editor;

	const editor = (dom: HTMLDivElement) => {
		const MakeEditor = Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, defaultValue?.value ?? '');
				ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
					data.value = markdown;
				});
				// Set testid
				ctx.update(editorViewOptionsCtx, (prev) => ({
					...prev,
					attributes: { 'data-testid': 'content' }
				}));
			})
			.use(commonmark)
			.use(gfm)
			.use(listener)
			.create();
		MakeEditor.then((editor) => {
			editorRef = editor;
		});
	};

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

	$: (() => {
		// Handle changes to default value
		if (defaultValue?.value) {
			editorRef?.action(replaceAll(defaultValue.value));
		}
	})();

	const clear = () => {
		defaultValue = null;
		data = { title: '', value: '' };
		editorRef?.action(replaceAll(''));
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
	<div class="Content" use:editor />
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
	}

	input,
	.Content :global([contenteditable]) {
		background: var(--white);
		border-radius: 0.3em;
		padding: 0.5em;
	}

	.Content :global([contenteditable]) {
		display: grid;
	}

	.Content :global([contenteditable] > *) {
		margin-top: 0;
	}
</style>
