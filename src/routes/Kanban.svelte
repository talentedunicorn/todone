<script lang="ts">
	import TaskShell from '../components/TaskShell.svelte';
	import KanbanView from '../components/KanbanView.svelte';
	import { createTaskDatabase } from '../db';
</script>

<svelte:head>
	<title>Kanban &#8212; ToDone</title>
</svelte:head>

{#await createTaskDatabase()}
	<p class="Message">Loading database... 👩🏼‍🔧</p>
{:then db}
	<TaskShell {db}>
		{#snippet children(data, handlers)}
			<KanbanView
				{data}
				onEdit={handlers.handleEdit}
				onDelete={handlers.handleDelete}
				onStatusChange={handlers.handleStatusChange}
			/>
		{/snippet}
	</TaskShell>
{:catch err}
	<p class="Message">Error loading database: {err.message}</p>
{/await}

<style>
	.Message {
		font-size: 1.5rem;
		padding: 2rem;
	}
</style>
