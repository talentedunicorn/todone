<script lang="ts">
	import { Auth0Client } from '@auth0/auth0-spa-js';

	import List from '../components/List.svelte';
	import Button from '../components/Button.svelte';
	import Menu from '../components/Menu.svelte';
	import { logout } from '../auth';
	import { push } from 'svelte-spa-router';
	import Form from '../components/Form.svelte';
	import type { Todo } from '../lib/pouchdb';
	import { update, add } from '../db';
	import {
		paginatedTodos,
		sortedTodos,
		setPage,
		setLimit,
		setQuery,
		remove,
		setCompleted,
		handleToggleExpand,
		expandAll,
		collapseAll
	} from '../stores/todos';
	import toastStore from '../stores/toast';
	import userStore from '../stores/user';
	import { title } from '../lib/helpers';
	import Search from '../components/Search.svelte';
	import Pagination from '../components/Pagination.svelte';

	const { setMessage, clearMessage } = toastStore;

	const { auth0: auth0Client } = $props<{ auth0: () => Auth0Client | undefined }>();
	let auth0 = auth0Client();

	let task = $state<Todo | null>(null);
	let currentPage = $derived($sortedTodos.page);

	let totalPages = $derived(Math.ceil($sortedTodos.todos.length / $sortedTodos.limit));

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

	const handleDelete = async (id: string) => {
		await remove(id);
		// Reset the page to 1 so if the last task in page 2 is deleted we aren't stuck in page 2
		setPage(1);
	};

	const deleteCompleted = (callback: () => void) => {
		setMessage('Delete all completed?', [
			{
				label: 'Yes',
				callback: () => {
					callback();
					clearMessage();
				}
			}
		]);
	};
</script>

<svelte:head>
	<title>{title()}</title>
</svelte:head>

<aside class="Menu">
	<Menu>
		<Button size="large" variant="link" onclick={() => push('/dashboard')}>Dashboard</Button>
	</Menu>
</aside>
<main class="Content">
	{#if $userStore.isLoggedIn}
		<div class="Profile">
			<img src={$userStore.user.picture} alt={$userStore.user.nickname} />
			<Button onclick={() => logout(auth0)}>Log out</Button>
		</div>
	{/if}
	<h2 class="Title">ToDone</h2>

	<Search bind:query={() => $sortedTodos.query, (query: string) => setQuery(query)} />
	<Form defaultValue={task} onSubmit={handleCreate} onUpdate={handleUpdate} onClear={clearEdit} />
	<List
		items={$paginatedTodos.todos}
		onEdit={(data) => {
			task = data;
		}}
		remove={handleDelete}
		{setCompleted}
		{handleToggleExpand}
		{expandAll}
		{collapseAll}
		{deleteCompleted}
	/>
	{#if totalPages > 0}
		<Pagination
			{currentPage}
			{totalPages}
			limit={$sortedTodos.limit}
			onPageChange={setPage}
			onLimitChange={setLimit}
		/>
	{/if}
</main>

<style>
	.Menu {
		position: fixed;
		top: 0;
		z-index: 9;
	}

	.Profile {
		display: flex;
		gap: 1rem;
		margin: 2rem;
		justify-content: end;
		align-items: center;

		img {
			inline-size: 3rem;
			border-radius: 100%;
		}
	}

	.Content {
		width: 100%;
		max-width: 80rem;
		padding: 0 2rem;
		margin: 0 auto 4rem;
		display: flex;
		flex-flow: column;
		gap: 1rem;
	}
</style>
