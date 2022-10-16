<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Form from '../lib/components/Form.svelte';
	import Logo from '../lib/components/Logo.svelte';
	import Menu from '../lib/components/Menu.svelte';
	import Task from '../lib/components/Task.svelte';
	import { db, add, update, remove } from '../pouchdb-store';

	let currentTab = 'To Do';
	/** @type {import('$lib/types').Todo[]} */
	let data = [];
	/** @type {import('$lib/types').Todo[]}*/
	$: completedTodos = data.filter((t) => t.completed === true);
	/** @type {import('$lib/types').Todo[]}*/
	$: incompleteTodos = data.filter((t) => t.completed === false);
	/**
	 * @type {import('$lib/types').Todo | null}
	 */
	let task = null;
	$: menuItems = [{ label: 'To Do' }, { label: 'Done' }].map((item) => ({
		...item,
		selected: item.label === currentTab
	}));

	$: renderedTodos = currentTab === 'To Do' ? incompleteTodos : completedTodos;

	const loadTodos = async () => {
		const todos = (await db.allDocs({ include_docs: true, descending: true })).rows.map(
			(t) => t.doc
		);
		data = [...todos];
	};

	onMount(() => {
		loadTodos();
		db.changes({
			since: 'now',
			live: true
		}).on('change', loadTodos);
	});

	function clearEdit() {
		task = null;
	}

	async function handleUpdate(
		/** @type {import('svelte').ComponentEvents<Form>['update']} */ { detail }
	) {
		update(detail).then(() => {
			clearEdit();
		});
	}

	async function handleCreate(
		/** @type {import('svelte').ComponentEvents<Form>['submit']} */ { detail }
	) {
		await add(detail);
	}

	function handleEdit(/** @type {import('$lib/types').Todo} */ value) {
		task = value;
	}

	function handleToggleComplete(/** @type {import('$lib/types').Todo} */ value) {
		update({ ...value, completed: !value?.completed });
	}
</script>

<div class="Wrapper">
	<div class="Menu">
		<Menu
			{menuItems}
			on:goTo={(event) => {
				currentTab = event.detail;
				clearEdit();
			}}
		/>
	</div>
	<h1 class="Logo" title="ToDone"><Logo /></h1>
	<main>
		{#key currentTab}
			<h2 class="Title" in:fly={{ y: -10 }}>{currentTab}</h2>
		{/key}
		{#if currentTab === 'To Do' || task}
			<div in:fly={{ y: 20 }}>
				<Form
					defaultValue={task}
					on:submit={handleCreate}
					on:update={handleUpdate}
					on:clear={clearEdit}
				/>
			</div>
		{/if}
		{#if renderedTodos.length > 0}
			{#each renderedTodos as { _id, _rev, title, value, completed }}
				<Task
					{title}
					body={value}
					{completed}
					on:edit={() => handleEdit({ _id, _rev, title, value, completed })}
					on:delete={() => remove(_id, _rev)}
					on:complete={() => handleToggleComplete({ _id, _rev, title, value, completed })}
				/>
			{/each}
		{:else}
			<p class="Message">Nothing found... 👀</p>
		{/if}
	</main>
</div>

<style>
	.Wrapper {
		min-height: 100vh;
		display: grid;
		row-gap: 2rem;
		grid-template-areas: 'menu . logo' 'content content content';
		grid-template-rows: min-content auto;
		grid-template-columns: min-content;
		align-items: start;
	}

	.Menu {
		grid-area: menu;
		max-height: 100vh;
		position: sticky;
		top: 0;
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
		grid-area: content;
		padding: 0 2rem;
		max-width: 80rem;
		width: 100%;
		margin: 0 auto 4rem;
		display: flex;
		flex-flow: column;
		gap: 2rem;
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
