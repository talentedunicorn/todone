<script>
	import '../app.css';
	import Logo from '$lib/components/Logo.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import { PUBLIC_SYNCED } from '$env/static/public';
	import { isLoggedin, tabs, currentTab, status } from '../stores';
	import Button from '$lib/components/Button.svelte';
	import { checkAuth, login } from '$lib/auth';
	import { onMount } from 'svelte';

	/**
	 * @type {HTMLElement}
	 */
	let wrapper;

	$: menuItems = tabs.map((item) => ({
		...item,
		selected: item.label === $currentTab
	}));

	const handleMenu = (/** @type {import('svelte').ComponentEvents<Menu>['goTo']} */ value) => {
		currentTab.set(value.detail);
		wrapper.scrollIntoView();
	};

	onMount(async () => {
		if (PUBLIC_SYNCED === 'true') {
			await checkAuth();
			if (!$isLoggedin) return;
		}
	});
</script>

<svelte:head>
	<title>ToDone</title>
</svelte:head>

<main class="Wrapper" bind:this={wrapper}>
	{#if PUBLIC_SYNCED === 'true' && !$isLoggedin}
		<div class="Login">
			<Logo />
			<Button on:click={login}>Log in</Button>
		</div>
	{:else}
		<div class="Menu">
			<Menu {menuItems} on:goTo={handleMenu} />
		</div>
		<header class="Header" >
			<h1 data-syncing={$status} class="Logo" title="ToDone"><Logo /></h1>
		</header>
		<section class="Content">
			<slot />
		</section>
	{/if}
</main>

<style>
	.Wrapper,
	.Login {
		flex-flow: column;
		display: flex;
	}

	.Login {
		padding: 2rem;
		gap: 2rem;
		align-items: flex-start;
	}

	.Menu {
		position: fixed;
		top: 0;
		z-index: 9;
	}

	.Header {
		align-self: flex-end;
	}

	.Logo {
		margin: 1rem;
		padding: 0.2em;
		border: var(--border);
		border-radius: 0.2em;
		background: var(--white);
		position: relative;
	}

	[data-syncing] {
		--indicator-color: var(--primary);
	}

	[data-syncing]:not([data-syncing='NOT_SYNCED'])::after {
		content: '';
		width: 0.5em;
		height: 0.5em;
		border-radius: 100%;
		background: var(--indicator-color);
		position: absolute;
		top: -0.2em;
		left: -0.2em;
	}

	[data-syncing='ERROR'] {
		--indicator-color: var(--red);
	}
</style>
