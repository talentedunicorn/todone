<script lang="ts">
	import TaskShell from '../components/TaskShell.svelte';
	import FlatList from '../components/FlatList.svelte';
	import Button from '../components/Button.svelte';
	import { isLoggedin, user } from '../stores';
	import { logout } from '../auth';
	import { getAuth0Client } from '../lib/auth-client';
	import { createTaskDatabase } from '../db';

	let auth0 = getAuth0Client;
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
		<TaskShell {db}>
			{#snippet children(data, handlers)}
				<FlatList
					{data}
					onView={handlers.handleViewContent}
					onEdit={handlers.handleEdit}
					onDelete={handlers.handleDelete}
					onStatusChange={handlers.handleStatusChange}
				/>
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
