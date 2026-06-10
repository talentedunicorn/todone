<script lang="ts">
	import TaskShell from '../components/TaskShell.svelte';
	import FlatList from '../components/FlatList.svelte';
	import KanbanView from '../components/KanbanView.svelte';
	import ViewToggle from '../components/ViewToggle.svelte';
	import SortControl from '../components/SortControl.svelte';
	import PaginationControls from '../components/PaginationControls.svelte';
	import Button from '../components/Button.svelte';
	import { isLoggedin, user } from '../stores';
	import { logout } from '../auth';
	import { getAuth0Client } from '../lib/auth-client';
	import { createTaskDatabase } from '../db';

	let auth0 = getAuth0Client;

	let view = $state<'list' | 'kanban'>(
		typeof localStorage !== 'undefined'
			? ((localStorage.getItem('todone:view') as 'list' | 'kanban') ?? 'list')
			: 'list'
	);

	const toggleView = (v: 'list' | 'kanban') => {
		view = v;
		localStorage.setItem('todone:view', v);
	};
</script>

<svelte:head>
	<title>ToDone &#8212; Get it done!</title>
</svelte:head>

<section class="Content">
	{#if $isLoggedin}
		<div class="Profile">
			<img src={$user.picture} alt={$user.nickname} />
			<Button onclick={() => auth0() && logout(auth0()!)}>Log out</Button>
		</div>
	{/if}
	{#await createTaskDatabase()}
		<p class="Message">Loading database... 👩🏼‍🔧</p>
	{:then db}
		<TaskShell
			{db}
			pageSize={view === 'list' ? 50 : 10000}
			onToggleView={() => toggleView(view === 'list' ? 'kanban' : 'list')}
		>
			{#snippet toolbar(sortState)}
				<ViewToggle {view} onToggle={toggleView} />
				<SortControl
					field={sortState.sortField}
					dir={sortState.sortDir}
					onChange={(f, d) => sortState.onSortChange(f, d)}
				/>
				<PaginationControls
					page={sortState.page}
					totalCount={sortState.totalCount}
					pageSize={sortState.pageSize}
					onChange={sortState.onPageChange}
				/>
			{/snippet}
			{#snippet children(data, handlers)}
				{#if view === 'list'}
					<FlatList
						{data}
						onView={handlers.handleViewContent}
						onEdit={handlers.handleEdit}
						onDelete={handlers.handleDelete}
						onStatusChange={handlers.handleStatusChange}
					/>
				{:else}
					<KanbanView
						{data}
						onView={handlers.handleViewContent}
						onEdit={handlers.handleEdit}
						onDelete={handlers.handleDelete}
						onStatusChange={handlers.handleStatusChange}
					/>
				{/if}
			{/snippet}
		</TaskShell>
	{:catch err}
		<p class="Message">Error loading database: {err.message}</p>
	{/await}
</section>

<style>
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

	.Message {
		font-size: 1.5rem;
		padding: 2rem;
	}

	.Content {
		display: flex;
		flex-flow: column;
		gap: 1.5rem;
	}
</style>
