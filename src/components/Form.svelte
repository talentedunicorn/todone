<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import { onMount, tick } from 'svelte';
	import Button from './Button.svelte';
	import { createEditorCarta } from '../lib/carta';
	import { themeObserver } from '../lib/theme-observer';
	import type { Todo, TaskStatus } from '../domain/todo';
	import { fly } from 'svelte/transition';

	type Content = { title: string; value: string };
	type FormTodo = Omit<Todo, 'id' | 'updated'> & { status?: TaskStatus };

	interface Props {
		defaultValue?: Todo | null;
		enableEditor?: boolean;
		onClear: () => void;
		onUpdate: (data: Todo) => Promise<void> | void;
		onSubmit: (data: Todo) => Promise<void> | void;
		onDelete?: (task: Todo) => Promise<void> | void;
	}

	let {
		defaultValue,
		enableEditor = true,
		onClear,
		onSubmit,
		onUpdate,
		onDelete
	}: Props = $props();

	let carta = $state<Carta | null>(null);
	let isBrowser = $state(false);

	const initializeEditor = async () => {
		await tick();
		isBrowser = true;
		carta = createEditorCarta({ enableCodeHighlighting: true });
	};

	onMount(() => {
		if (typeof window === 'undefined' || !enableEditor) return;

		void initializeEditor();
	});

	let titleInput: HTMLInputElement;
	let titleFocused = $state(false);

	let data = $state<FormTodo>({ title: '', value: '', status: 'todo' });

	$effect(() => {
		if (defaultValue) {
			data = defaultValue;
		}
	});

	const isEdit = $derived(defaultValue !== null);

	const isEmpty = $derived(data.value.trim().length < 1);

	const invalid = $derived(data.title.trim().length < 1 || isEmpty);
	const buttonText = $derived(isEdit ? 'Update' : 'Submit');

	const clear = () => {
		defaultValue = null;
		data = { title: '', value: '', status: 'todo' };
		onClear();
	};

	const submit = async () => {
		if (isEdit) {
			await onUpdate(data as Todo);
		} else {
			await onSubmit(data as Todo);
		}
		clear();
	};

	$effect(() => {
		if (isEdit && titleInput) {
			window.scrollTo({ top: titleInput.scrollHeight });
			titleInput.focus();
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

	{#if isEdit}
		<fieldset class="Status">
			<legend>Status</legend>
			<div class="Badges">
				<Button
					size="small"
					selected={data.status === 'todo'}
					onclick={() => (data.status = 'todo')}
				>
					To Do
				</Button>
				<Button
					size="small"
					selected={data.status === 'in-progress'}
					onclick={() => (data.status = 'in-progress')}
				>
					In Progress
				</Button>
				<Button
					size="small"
					selected={data.status === 'done'}
					onclick={() => (data.status = 'done')}
				>
					Done
				</Button>
			</div>
		</fieldset>
	{/if}

	<label class="visually-hidden" for="content">Content</label>
	<div class="editor-wrapper open">
		<div class="inner">
			<div
				use:themeObserver={{
					createInstance: () => createEditorCarta({ enableCodeHighlighting: true }),
					onUpdate: (c) => (carta = c)
				}}
			>
				{#if isBrowser && carta}
					{#key carta}
						<MarkdownEditor
							{carta}
							bind:value={data.value}
							userLabels={{
								iconsLabels: {
									heading: 'Heading'
								}
							}}
							mode="tabs"
						/>
					{/key}
				{/if}
			</div>
		</div>
	</div>
	{#if !invalid}
		<div class="Actions" transition:fly={{ y: 5 }}>
			<div class="Delete">
				{#if isEdit && onDelete}
					<Button variant="link" onclick={() => onDelete(data as Todo)}>Delete</Button>
				{/if}
			</div>
			<div class="Save">
				<Button data-testid="cancel" data-umami-event="Cancel edit" onclick={clear}>Cancel</Button>
				<Button data-testid="submit" data-umami-event="Save" type="submit" variant="primary"
					>{buttonText}</Button
				>
			</div>
		</div>
	{/if}
</form>

<style>
	form {
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
			align-items: center;
			justify-content: space-between;
		}

		& .Actions .Delete {
			display: flex;
			align-items: center;
		}

		& .Actions .Save {
			display: flex;
			gap: 1rem;
			align-items: center;
		}

		.Status {
			display: flex;
			align-items: center;
			gap: 1rem;
			font-size: 0.9rem;
			border: none;
			padding: 0;
			margin: 0;

			legend {
				font-weight: bold;
				margin-bottom: 1rem;
			}

			.Badges {
				display: flex;
				gap: 1rem;
			}
		}

		.editor-wrapper {
			width: 100%;
			border-radius: 1rem;
			border: 0.2em solid var(--black);
			overflow: hidden;
			display: grid;
			grid-template-rows: 1fr;

			& .inner {
				overflow: hidden;
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
	}

	:global(img) {
		border-radius: 0.5rem;
	}

	:global(:not(pre) > code) {
		background: var(--gray-light);
		padding: 2px 4px;
		border-radius: 3px;
	}

	:global(.carta-renderer, .carta-input) {
		max-height: 25rem; /* Sets a maximum height for the editor and input */
	}

	:global(.carta-toolbar) {
		background-color: var(--white) !important;
		color: var(--black) !important;
		border: none !important;
		border-bottom: 0.1em solid var(--gray-light) !important;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	:global(.carta-toolbar button) {
		color: var(--black) !important;
		background: transparent !important;
		border: none !important;
		cursor: pointer;
		padding: 0.5rem !important;
		font-size: 1rem !important;
		font-family: inherit !important;

		&:hover {
			background-color: var(--gray-light) !important;
		}
	}

	:global(.carta-icon) {
		width: 2rem !important;
		height: 2rem !important;
	}

	:global(.carta-font-code) {
		caret-color: var(--black) !important;
		font-size: 1rem !important;
		font-family: monospace;
		line-height: 1.7 !important;
	}

	:global(.carta-icons-menu) {
		background: var(--white) !important;
		color: var(--black) !important;
	}

	:global(.carta-icons-menu button) {
		color: var(--black) !important;
	}

	:global(.carta-renderer .shiki) {
		padding: 1rem;
		font-size: 1rem;
		border-radius: 0.5rem;
		overflow: auto;
	}

	/** Handle dual themes*/

	:global([data-theme='dark'] .carta-theme__default) {
		--border-color: var(--border-color-dark);
		--selection-color: var(--selection-color-dark);
		--focus-outline: var(--focus-outline-dark);
		--hover-color: var(--hover-color-dark);
		--caret-color: var(--caret-color-dark);
		--text-color: var(--text-color-dark);
	}

	:global([data-theme='dark'] .carta-input .shiki, [data-theme='dark'] .carta-input .shiki span) {
		color: var(--shiki-dark) !important;
	}

	@media (prefers-color-scheme: dark) {
		:global(html:not([data-theme='light']) .carta-theme__default) {
			--border-color: var(--border-color-dark);
			--selection-color: var(--selection-color-dark);
			--focus-outline: var(--focus-outline-dark);
			--hover-color: var(--hover-color-dark);
			--caret-color: var(--caret-color-dark);
			--text-color: var(--text-color-dark);
		}

		:global(
			html:not([data-theme='light']) .shiki,
			html:not([data-theme='light']) .carta-input .shiki span
		) {
			color: var(--shiki-dark) !important;
		}
	}
</style>
