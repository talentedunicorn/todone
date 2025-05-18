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
	import todoStore, { paginatedTodos, sortedTodos } from '../stores/todos';
	import toastStore from '../stores/toast';
	import userStore from '../stores/user';
	import { title } from '../lib/helpers';
	import Search from '../components/Search.svelte';

	const {
		setPage,
		setLimit,
		setQuery,
		remove,
		setCompleted,
		handleToggleExpand,
		expandAll,
		collapseAll
	} = todoStore;
	const { setMessage, clearMessage } = toastStore;

	const { auth0: auth0Client } = $props<{ auth0: () => Auth0Client | undefined }>();
	let auth0 = auth0Client();

	let task = $state<Todo | null>(null);
	let currentPage = $derived($todoStore.page);

	let totalPages = $derived(Math.ceil($sortedTodos.todos.length / $todoStore.limit));
	const lastPage = $derived(currentPage === totalPages);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

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

	<Search bind:query={() => $todoStore.query, (query: string) => setQuery(query)} />
	<Form defaultValue={task} onSubmit={handleCreate} onUpdate={handleUpdate} onClear={clearEdit} />
	<List
		items={$paginatedTodos.todos}
		onEdit={(data) => {
			task = data;
		}}
		{remove}
		{setCompleted}
		{handleToggleExpand}
		{expandAll}
		{collapseAll}
		{deleteCompleted}
	/>
	<div class="Pagination">
		<div>
			<select onchange={(e) => setLimit(Number((e.currentTarget as HTMLSelectElement).value))}>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
				<option value="100">100</option>
			</select>
			<span>items per page</span>
		</div>
		<section class="Pagination-controls">
			<p>{currentPage} of <span class="Title">{totalPages}</span></p>
			<Button
				onclick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				variant="link"
				size="small"
			>
				Previous
			</Button>
			<Button
				onclick={() => handlePageChange(currentPage + 1)}
				disabled={lastPage}
				variant="link"
				size="small"
			>
				Next
			</Button>
		</section>
	</div>
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

	.Pagination {
		display: flex;
		align-items: end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 2rem;
		margin-top: 2rem;

		& > * {
			display: inline-flex;
			flex-flow: row;
			align-items: inherit;
			gap: 1rem;
		}

		.Pagination-controls {
			margin-left: auto;
			font-weight: bold;

			p,
			.Title {
				margin: 0;
			}
		}
	}
</style>
