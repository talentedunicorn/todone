<script lang="ts">
	import { fly } from 'svelte/transition';
	import Form from './components/Form.svelte';
	import Task from './components/Task.svelte';
	import Button from './components/Button.svelte';
	import { currentTab, toastActions, toastMessage } from './stores';
	import todoStore, { incompleteTodos, completedTodos } from './stores/todos';
	import { type Todo } from './lib/pouchdb';

	const {
		add,
		remove,
		update,
		setCompleted,
		loadData: loadTodos,
		handleToggleExpand,
		expandAll,
		collapseAll
	} = todoStore;

	let task = $state<Todo | null>(null);

	let searchInput: HTMLInputElement;

	let query = $state('');
	let showSearch = $state(false);
	let deleting = $state(false);

	let currentTodos = $derived($currentTab === 'To Do' ? $incompleteTodos : $completedTodos);
	let renderedTodos = $derived(
		currentTodos.todos.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
	);

	const clearEdit = () => {
		task = null;
	};

	const handleUpdate = async (data: Todo) => {
		update(data).then(() => {
			clearEdit();
		});
	};

	const handleCreate = async (data: Pick<Todo, 'title' | 'value'>) => {
		await add(data);
	};

	const handleEdit = (updated: Todo) => {
		task = {
			...updated
		};
	};

	const handleDelete = async (id: string) => {
		await remove(id);
	};

	const handleToggleComplete = async (task: Todo) => {
		await setCompleted(task._id!, !task.completed);
	};

	const deleteCompleted = () => {
		toastMessage.set('Delete all completed?');
		toastActions.set([
			{
				label: 'Yes',
				callback: () => {
					clearCompleted();
					toastActions.set(null);
					toastMessage.set(null);
				}
			}
		]);
	};
	const clearCompleted = async () => {
		deleting = true;
		await Promise.all(
			$completedTodos.todos.filter((t) => t._id).map((t) => remove(t._id!))
		).finally(() => {
			deleting = false;
		});
	};
</script>

<main>
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
				onclick={() => {
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
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m9 6l6 6l-6 6"
					/>
				</svg>
			</Button>
		{:else}
			<Button
				onclick={() => {
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
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11.36 20.213L9 21v-8.5L4.52 7.572A2 2 0 0 1 4 6.227V4h16v2.172a2 2 0 0 1-.586 1.414L15 12m0 6a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.2 2.2L22 22"
					/>
				</svg>
			</Button>
		{/if}
	</form>
	{#if $currentTab === 'To Do' || task}
		<div in:fly={{ y: -20 }}>
			<Form
				defaultValue={task}
				onSubmit={handleCreate}
				onUpdate={handleUpdate}
				onClear={clearEdit}
			/>
		</div>
	{/if}
	{#await loadTodos()}
		<p class="Message">Loading data... 👩🏼‍🔧</p>
	{:then _}
		{#if renderedTodos.length > 0}
			{#if $currentTab === 'Done'}
				<div>
					<Button onclick={deleteCompleted} disabled={deleting}>Clear completed</Button>
				</div>
			{/if}
			<div>
				<Button variant="link" size="small" class="ToggleExpand" onclick={expandAll}
					>Expand all</Button
				>
				<Button variant="link" size="small" class="ToggleExpand" onclick={collapseAll}
					>Collapse all</Button
				>
			</div>
			{#each renderedTodos as task, i (i)}
				{@const { _id, title, value, completed, updated, expanded } = task}
				<div transition:fly={{ duration: 500, y: 100 }}>
					<Task
						id={`task-${i}`}
						{title}
						{value}
						{completed}
						updated={new Date(updated)}
						{expanded}
						onEdit={() => handleEdit(task)}
						onDelete={() => handleDelete(_id!)}
						onComplete={() => handleToggleComplete(task)}
						onToggleExpand={(expanded) => handleToggleExpand(_id!, expanded)}
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

	.Search {
		align-self: flex-end;
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

	main :global(.ToggleExpand) {
		margin-left: auto;
	}
</style>
