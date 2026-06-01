<script lang="ts">
	import TaskShell from '../components/TaskShell.svelte';
	import ArchiveView from '../components/ArchiveView.svelte';
	import { createTaskDatabase } from '../db';
</script>

<svelte:head>
	<title>Archive &#8212; ToDone</title>
</svelte:head>

{#await createTaskDatabase()}
	<p class="Message">Loading database... 👩🏼‍🔧</p>
{:then db}
	<TaskShell {db}>
		{#snippet children(data)}
			<ArchiveView {data} />
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
