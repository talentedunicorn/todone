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
	$: completedTodos = data.filter((t) => t.completed === true);
	/** @type {import('$lib/types').Todo[]}*/
	$: incompleteTodos = data.filter((t) => t.completed === false);
	/**
	 * @type {import('$lib/types').Todo | null}
	 */
	let task = null;

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
</script>

<main>
	{#if $isLoggedin}
		<div class="Profile">
			{$user.name}
			<Button on:click={logout}>Log out</Button>
		</div>
	{/if}
	{#key $currentTab}
		<h2 class="Title" in:fly={{ y: -10 }}>{$currentTab}</h2>
	{/key}
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
</style>
