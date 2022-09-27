<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Form from '../lib/components/Form.svelte';
	import Logo from '../lib/components/Logo.svelte';
	import Menu from '../lib/components/Menu.svelte';
	import Task from '../lib/components/Task.svelte';
	import { db, add, edit, remove, toggleComplete } from '../rxdb-store';

	let currentTab = 'To Do';
	/** @type {import('rxdb').RxDatabase}*/
	let db$;
	/** @type {any[]}*/
	let completedTodos = [];
	/** @type {any[]}*/
	let incompleteTodos = [];
	/**
	 * @type {{ id: string, title: string, value: string }}
	 */
	let editing = { id: '', title: '', value: '' };
	$: menuItems = [{ label: 'To Do' }, { label: 'Done' }].map((item) => ({
		...item,
		selected: item.label === currentTab
	}));

	$: renderedTodos = currentTab === 'To Do' ? incompleteTodos : completedTodos;

	onMount(() => {
		// Load data on mount
		const getTodos = async () => {
			db$ = await db();
			db$.todos
				.find({
					selector: {
						completed: {
							$eq: true
						}
					}
				})
				.$.subscribe({
					next: (data) => {
						completedTodos = data;
					}
				});
			db$.todos
				.find({
					selector: {
						completed: {
							$eq: false
						}
					}
				})
				.$.subscribe({
					next: (data) => {
						incompleteTodos = data;
					}
				});
		};

		getTodos();
	});

	function clearEdit() {
		editing = { id: '', title: '', value: '' };
	}

	async function handleUpdate(
		/** @type import('svelte').ComponentEvents<Form>['update']> */ { detail }
	) {
		edit(detail);
		clearEdit();
	}

	function handleEdit(task) {
		editing = task;
	}
</script>

<div class="Wrapper">
	<div class="Menu">
		<Menu
			{menuItems}
			on:goTo={(event) => {
				currentTab = event.detail;
			}}
		/>
	</div>
	<h1 class="Logo" title="ToDone"><Logo /></h1>
	<main>
		{#key currentTab}
			<h2 class="Title" in:fly={{ y: -10 }}>{currentTab}</h2>
		{/key}
		{#if currentTab === 'To Do' || editing.id !== ''}
			<div in:fly={{ y: 20 }}>
				<Form
					data={editing}
					on:submit={(e) => add(e.detail)}
					on:update={handleUpdate}
					on:clear={clearEdit}
				/>
			</div>
		{/if}
		{#await renderedTodos}
			<p class="Message">💨 Loading...</p>
		{:then results}
			{#if results.length > 0}
				{#each results as { id, title, value, updated, completed }}
					<Task
						{title}
						body={value}
						{updated}
						{completed}
						on:edit={() => handleEdit({ id, title, value })}
						on:delete={() => remove(id)}
						on:complete={() => toggleComplete(id)}
					/>
				{/each}
			{:else}
				<p class="Message">Nothing found... 👀</p>
			{/if}
		{/await}
	</main>
</div>

<style>
	.Wrapper {
		min-height: 100vh;
		display: grid;
		row-gap: 2rem;
		grid-template-areas: 'menu logo' 'content content';
		grid-template-rows: min-content auto;
		grid-template-columns: auto min-content;
		align-items: start;
	}

	.Menu {
		grid-area: menu;
		position: sticky;
		top: 0;
		flex: 1;
		max-height: 100vh;
	}

	.Logo {
		grid-area: logo;
		justify-self: end;
		display: inline-block;
		border: var(--border);
		background: var(--white);
		padding: 0.2em;
		border-radius: 0.2em;
		margin: 1rem;
		top: 1rem;
	}

	main {
		padding: 0 2rem;
		max-width: 80rem;
		width: 100%;
		margin: 0 auto 4rem;
		display: flex;
		flex-flow: column;
		gap: 2rem;
		grid-column: span 2;
	}

	.Title {
		font-size: clamp(2rem, 5vw, 5rem);
		font-weight: 100;
		margin: 1rem 0 0;
		color: var(--gray);
	}

	.Message {
		font-size: 1.5rem;
	}

	@media screen and (min-width: 50rem) {
		.Wrapper {
			grid-template-areas: 'menu content logo';
			grid-template-columns: max-content auto min-content;
		}

		main {
			grid-column: unset;
		}
	}
</style>
