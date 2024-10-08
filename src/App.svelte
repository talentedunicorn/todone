<script lang="ts">
	import './app.css';
	import Logo from './components/Logo.svelte';
	import Menu from './components/Menu.svelte';
	import { isLoggedin, tabs, currentTab, status, user } from './stores';
	import Button from './components/Button.svelte';
	import { checkAuth, initAuth0Client, login, logout } from './auth';
	import { onMount, type ComponentEvents } from 'svelte';
	import { fly } from 'svelte/transition';
	import List from './List.svelte';
	import type { Auth0Client } from '@auth0/auth0-spa-js';
	import ReloadPrompt from './components/ReloadPrompt.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import ExportImport from './components/ExportImport.svelte';
	import Toast from './components/Toast.svelte';

	let auth0: Auth0Client;
	let wrapper: HTMLElement;

	$: menuItems = tabs.map((item) => ({
		...item,
		selected: item.label === $currentTab
	}));

	let showBackToTop = false;

	const handleMenu = (event: ComponentEvents<Menu>['goTo']) => {
		currentTab.set(event.detail);
		scrollToTop();
	};

	const scrollToTop = () => {
		wrapper.scrollIntoView({
			behavior: 'smooth'
		});
	};

	const handleBackToTop = () => {
		window.addEventListener('scroll', () => {
			const scrolled = document.querySelector('html')?.scrollTop || 0;
			showBackToTop = scrolled > window.innerHeight;
		});
	};

	onMount(async () => {
		handleBackToTop();
		if (import.meta.env.VITE_SYNCED === 'true' && navigator.onLine) {
			if (!auth0) {
				auth0 = await initAuth0Client();
			}
			try {
				await checkAuth(auth0);
				if (!$isLoggedin) return;
			} catch (e) {
				// Log out on failure
				logout(auth0);
			}
		}
	});
</script>

<svelte:head>
	{#if import.meta.env.PROD}
		{pwaInfo?.webManifest.linkTag}
	{/if}
</svelte:head>

<main class="Wrapper" bind:this={wrapper}>
	{#if import.meta.env.VITE_SYNCED === 'true' && !$isLoggedin}
		<div class="Login">
			<Logo />
			<Button on:click={() => login(auth0)}>Log in</Button>
		</div>
	{:else}
		<div class="Menu">
			<Menu {menuItems} on:goTo={handleMenu}>
				<ExportImport />
			</Menu>
		</div>
		<header class="Header">
			<h1 data-syncing={$status} class="Logo" title="ToDone"><Logo /></h1>
		</header>
		<section class="Content">
			{#if $isLoggedin}
				<div class="Profile">
					{$user.name}
					<Button on:click={() => logout(auth0)}>Log out</Button>
				</div>
			{/if}
			<List />
		</section>
	{/if}
	{#if showBackToTop}
		<footer class="Footer" transition:fly={{ y: 100, duration: 500 }}>
			<Button on:click={scrollToTop}
				><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width={25}>
					<title>Back to top</title>
					<path
						d="M5.707 12.707l5.293-5.293v11.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-11.586l5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-7-7c-0.092-0.092-0.202-0.166-0.324-0.217s-0.253-0.076-0.383-0.076c-0.256 0-0.512 0.098-0.707 0.293l-7 7c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"
					/>
				</svg></Button
			>
		</footer>
	{/if}
	<Toast />
</main>

{#if 'serviceWorker' in navigator && import.meta.env.PROD}
	<ReloadPrompt />
{/if}

<style>
	.Wrapper,
	.Login {
		flex-flow: column;
		display: flex;
		min-height: 100vh;
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
		background: var(--white);
		position: relative;
	}

	.Footer {
		align-self: flex-end;
		position: sticky;
		bottom: 2rem;
		padding: 0 1rem 0 0;
		display: flex;
		justify-content: flex-end;
	}

	.Profile {
		display: flex;
		gap: 1rem;
		margin: 2rem;
		justify-content: end;
		align-items: center;
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
