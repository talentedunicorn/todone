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
					variant="pill"
					selected={data.status === 'todo'}
					onclick={() => (data.status = 'todo')}
				>
					To Do
				</Button>
				<Button
					variant="pill"
					selected={data.status === 'in-progress'}
					onclick={() => (data.status = 'in-progress')}
				>
					In Progress
				</Button>
				<Button
					variant="pill"
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
			<Button data-testid="cancel" data-umami-event="Cancel edit" onclick={clear}>Cancel</Button>

			<div>
				{#if isEdit && onDelete}
					<Button variant="link" onclick={() => onDelete(data as Todo)}>Delete</Button>
				{/if}
				<Button data-testid="submit" data-umami-event="Save" type="submit" variant="primary"
					>{buttonText}</Button
				>
			</div>
		</div>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		gap: 1rem;

		& .Actions {
			display: flex;
			gap: 1rem;
			align-items: center;
			justify-content: space-between;
			margin-top: auto;

			& > div {
				display: flex;
				gap: 1rem;
				align-items: center;
			}
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
			flex: 1;
			min-height: 0;
			border-radius: 1rem;
			border: 0.2em solid var(--black);
			overflow: hidden;
			display: grid;
			grid-template-rows: 1fr;

			& .inner {
				display: flex;
				flex-direction: column;
				overflow: hidden;
				height: 100%;
				min-height: 0;

				/* Theme observer div — fill available height */
				> :global(div) {
					flex: 1;
					min-height: 0;
					display: flex;
					flex-direction: column;
				}
			}
		}

		input {
			width: 100%;
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
		word-wrap: break-word;
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
		flex-shrink: 0 !important;
	}

	:global(.carta-toolbar-right) {
		flex-shrink: 0 !important;
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

	/* Override carta-md default fixed 600px height — make editor fill available space */
	:global(.carta-theme__default.carta-editor) {
		flex: 1;
		min-height: 0;
	}

	:global(.carta-theme__default .carta-wrapper) {
		flex: 1;
		min-height: 0;
		height: auto;
		display: flex;
		flex-direction: column;
	}

	:global(.carta-theme__default .carta-container) {
		flex: 1;
		min-height: 0;
	}

	:global(.carta-theme__default .carta-input) {
		height: 100% !important;
		min-height: 75px; /* Works on devices with keyboards */
	}

	:global(.carta-theme__default .carta-container > .carta-input) {
		margin: 0;
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
