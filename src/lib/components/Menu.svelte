<script>
	import { fade, fly } from 'svelte/transition';
	import Button from './Button.svelte';

	export let title = '';
	let opened = true;
	export /**
	 * @type {{label: string, selected?: boolean }[]}
	 */
	let menuItems = [];
</script>

<nav class={opened ? '' : 'closed'}>
	<Button
		variant="primary"
		on:click={() => {
			opened = !opened;
		}}
	>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M2 2H22M2 12H22M2 22H22"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
			/>
		</svg>
	</Button>
	{#if opened}
		<div out:fly={{ x: -50, duration: 200 }} in:fade>
			{#if title}
				<header>{title}</header>
			{/if}
			{#each menuItems as menuitem (menuitem.label)}
				<Button variant="link" size="large" selected={menuitem.selected}>{menuitem.label}</Button>
			{/each}
		</div>
	{/if}
</nav>

<style>
	nav,
	nav > div {
		display: flex;
		gap: 1rem;
	}
	
	nav {
		flex-flow: column;
		background-color: var(--nav-bg, var(--gray-light));
		padding: 1rem;
		align-items: start;
		transition: all var(--ease) 0.7s;
		border-bottom-right-radius: 1rem;
	}
	
	.closed {
		--nav-bg: none;
		width: max-content;
	}

	header {
		font-size: 2rem;
		color: var(--gray);
	}
</style>
