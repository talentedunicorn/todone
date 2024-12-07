<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { type Snippet } from 'svelte';
	import Button from './Button.svelte';

	let opened = $state(false);
	interface Props {
		title?: string;
		menuItems?: any;
		children?: Snippet;
		goTo: (path: string) => void;
	}

	let { title = '', menuItems = [], children, goTo }: Props = $props();
</script>

<nav class={opened ? '' : 'closed'}>
	<Button
		variant="primary"
		onclick={() => {
			opened = !opened;
		}}
	>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<title>{opened ? 'Close menu' : 'Open menu'}</title>
			<path
				d="M2 2H22M2 12H22M2 22H22"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
			/>
		</svg>
	</Button>
	{#if opened}
		<div data-testId="menu" out:fly={{ x: -50, duration: 200 }} in:fade>
			{#if title}
				<header data-testId="header">{title}</header>
			{/if}
			{#each menuItems as menuitem (menuitem.label)}
				<Button
					variant="link"
					size="large"
					selected={menuitem.selected}
					onclick={() => {
						goTo(menuitem.label);
						opened = false;
					}}>{menuitem.label}</Button
				>
			{/each}
			{@render children?.()}
		</div>
	{/if}
</nav>

<style>
	nav,
	nav > div {
		display: flex;
		flex-flow: column;
		gap: 2rem;
	}

	nav {
		background-color: var(--nav-bg, var(--gray-light));
		padding: 1rem;
		align-items: start;
		transition: background-color var(--ease) 0.5;
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

	@media screen and (min-width: 60rem) {
		nav,
		nav > div {
			flex-flow: row;
			align-items: center;
		}
	}
</style>
