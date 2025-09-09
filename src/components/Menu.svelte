<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { type Snippet } from 'svelte';
	import Button from './Button.svelte';

	let opened = $state(false);
	interface Props {
		title?: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
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
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 6h10M4 12h16M7 12h13M4 18h10"
			/>
		</svg>
	</Button>
	{#if opened}
		<div data-testId="menu" out:fly={{ x: -50, duration: 200 }} in:fade>
			{#if title}
				<header data-testId="header">{title}</header>
			{/if}
			{@render children?.()}
		</div>
	{/if}
</nav>

<style>
	nav {
		background-color: var(--nav-bg, var(--gray-light));
		padding: 1rem;
		align-items: start;
		transition: background-color var(--ease) 0.5;
		border-bottom-right-radius: 1rem;

		&,
		& > div {
			display: flex;
			flex-flow: column;
			gap: 2rem;
		}
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
		nav {
			&,
			& > div {
				flex-flow: row;
				align-items: center;
			}
		}
	}
</style>
