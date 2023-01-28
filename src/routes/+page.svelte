<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Form from '$lib/components/Form.svelte';
	import Task from '$lib/components/Task.svelte';
	import Button from '$lib/components/Button.svelte';
	import { getTodos, add, update, remove, onChangeHandler } from '$lib/database';
	import { isLoggedin, user, currentTab } from '../stores';
	import { logout } from '$lib/auth';

	/** @type {import('$lib/types').Todo[]} */
	let data = [];
	/** @type {import('$lib/types').Todo[]}*/
	$: filtered = data
		.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
		.map((t) => (t.updated ? t : { ...t, updated: new Date(t._id) })) // Set _id as updated for now until we migrate all tasks
		// Sort by updated or ID
		.sort((a, b) => {
			if (a.updated && b.updated) {
				return new Date(b.updated).getTime() - new Date(a.updated).getTime();
			}
			return 0;
		});
	/** @type {import('$lib/types').Todo[]}*/
	$: completedTodos = filtered.filter((t) => t.completed === true);
	/** @type {import('$lib/types').Todo[]}*/
	$: incompleteTodos = filtered.filter((t) => t.completed === false);
	/** @type {import('$lib/types').Todo | null} */
	let task = null;

	/** @type {HTMLInputElement} */
	let searchInput;

	let query = '';
	let showSearch = false;
	let deleting = false;

	$: renderedTodos = $currentTab === 'To Do' ? incompleteTodos : completedTodos;

	const loadTodos = async () => {
		const todos = await getTodos();
		data = [...todos];
	};

	onMount(async () => {
		await loadTodos();
		onChangeHandler(loadTodos);
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

	async function clearCompleted() {
		deleting = true;
		Promise.all(completedTodos.map((t) => remove(t._id, t._rev))).then(() => {
			deleting = false;
		});
	}
</script>

<main>
	{#if $isLoggedin}
		<div class="Profile">
			{$user.name}
			<Button on:click={logout}>Log out</Button>
		</div>
	{/if}
	<h2 class="Title">{$currentTab}</h2>
	<form class="Search">
		<label for="search" class="visually-hidden">Search by title</label>
		<input
			type="search"
			name="query"
			id="search"
			class:visually-hidden={!showSearch}
			bind:value={query}
			bind:this={searchInput}
			placeholder="Type to search"
		/>
		{#if showSearch}
			<Button
				on:click={() => {
					showSearch = false;
					query = '';
				}}
				size="small"
				variant="link"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Hide search"
				>
					<path
						d="M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"
					/>
				</svg>
			</Button>
		{:else}
			<Button
				on:click={() => {
					showSearch = true;
					searchInput.focus();
				}}
				size="small"
				variant="link"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Show search"
				>
					<path
						d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
					/>
				</svg>
			</Button>
		{/if}
	</form>
	{#if $currentTab === 'To Do' || task}
		<div in:fly={{ y: 20 }}>
			<Form
				defaultValue={task}
				on:submit={handleCreate}
				on:update={handleUpdate}
				on:clear={clearEdit}
			/>
		</div>
	{/if}
	{#await loadTodos()}
		<p class="Message">Loading data... 👩🏼‍🔧</p>
	{:then _}
		{#if renderedTodos.length > 0}
			{#if $currentTab === 'Done'}
				<div>
					<Button on:click={clearCompleted} disabled={deleting}>Clear completed</Button>
				</div>
			{/if}
			{#each renderedTodos as task, i (i)}
				{@const { _id, _rev, title, value, completed, updated } = task}
				<div transition:fly={{ duration: 500, y: 100 }}>
					<Task
						{title}
						{value}
						{completed}
						{updated}
						on:edit={() => handleEdit({ _id, _rev, title, value, completed })}
						on:delete={() => remove(_id, _rev)}
						on:complete={() => handleToggleComplete({ _id, _rev, title, value, completed })}
					/>
				</div>
			{/each}
		{:else}
			<p class="Message">Nothing found... 👀</p>
		{/if}
	{/await}
</main>

<style>
	main {
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

	.Profile {
		display: flex;
		gap: 1rem;
		margin: 1rem 0 0;
		justify-content: end;
		align-items: center;
	}

	.Search {
		align-self: flex-end;
		position: sticky;
		top: 1rem;
		display: inline-flex;
		gap: 1rem;
		padding: 0.5rem;
		background: var(--white);
		border-radius: 0.5rem;
		border: var(--gray-light) 1px solid;
	}

	.Search input {
		flex: 1;
		border: none;
		border-radius: 0.5rem;
		padding: 0.5em;
		font-size: 1rem;
		font-family: inherit;
	}
</style>
