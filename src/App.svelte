<script lang="ts">
	import './app.css';
	import Logo from './components/Logo.svelte';
	import Menu from './components/Menu.svelte';
	import { isLoggedin, tabs, currentTab, status, user } from './stores';
	import Button from './components/Button.svelte';
	import { checkAuth, initAuth0Client, login, logout } from './auth';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import List from './List.svelte';
	import type { Auth0Client } from '@auth0/auth0-spa-js';
	import ReloadPrompt from './components/ReloadPrompt.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import ExportImport from './components/ExportImport.svelte';
	import Toast from './components/Toast.svelte';
	import { toastActions, toastMessage } from './stores';

	let auth0: Auth0Client;
	let wrapper: HTMLElement;
	let theme = $state<string | null>(null);

	let menuItems = $derived(
		tabs.map((item) => ({
			...item,
			selected: item.label === $currentTab
		}))
	);

	let showBackToTop = $state(false);

	const handleMenu = (path: string) => {
		currentTab.set(path);
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

	const toggleTheme = () => {
		const html = document.querySelector('html');
		const themeData = html?.getAttribute('data-theme');
		// const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
		let nextTheme;
		switch (themeData) {
			case 'dark':
				nextTheme = 'light';
				break;
			case 'light':
				nextTheme = null;
				break;
			default:
				nextTheme = 'dark';
				break;
		}
		theme = nextTheme;
		nextTheme ? html?.setAttribute('data-theme', nextTheme) : html?.removeAttribute('data-theme');
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
			<Button onclick={() => login(auth0)}>Log in</Button>
		</div>
	{:else}
		<aside class="Menu">
			<Menu {menuItems} goTo={handleMenu}>
				<ExportImport />
			</Menu>
		</aside>
		<header class="Header">
			<h1 data-syncing={$status} class="Logo" title="ToDone"><Logo /></h1>
		</header>
		<section class="Content">
			{#if $isLoggedin}
				<div class="Profile">
					{$user.name}
					<Button onclick={() => logout(auth0)}>Log out</Button>
				</div>
			{/if}
			<List />
		</section>
	{/if}
	{#if showBackToTop}
		<footer class="Footer" transition:fly={{ y: 100, duration: 500 }}>
			<Button onclick={scrollToTop}
				><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width={25}>
					<title>Back to top</title>
					<path
						d="M5.707 12.707l5.293-5.293v11.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-11.586l5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-7-7c-0.092-0.092-0.202-0.166-0.324-0.217s-0.253-0.076-0.383-0.076c-0.256 0-0.512 0.098-0.707 0.293l-7 7c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"
					/>
				</svg></Button
			>
		</footer>
	{/if}
	<Button size="small" class="ColorToggle" variant="link" onclick={toggleTheme}>
		{#if theme === 'dark'}
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Dark</title>
				<path
					d="M21.996 12.882c0.022-0.233-0.038-0.476-0.188-0.681-0.325-0.446-0.951-0.544-1.397-0.219-0.95 0.693-2.060 1.086-3.188 1.162-1.368 0.092-2.765-0.283-3.95-1.158-1.333-0.985-2.139-2.415-2.367-3.935s0.124-3.124 1.109-4.456c0.142-0.191 0.216-0.435 0.191-0.691-0.053-0.55-0.542-0.952-1.092-0.898-2.258 0.22-4.314 1.18-5.895 2.651-1.736 1.615-2.902 3.847-3.137 6.386-0.254 2.749 0.631 5.343 2.266 7.311s4.022 3.313 6.772 3.567 5.343-0.631 7.311-2.266 3.313-4.022 3.567-6.772zM19.567 14.674c-0.49 1.363-1.335 2.543-2.416 3.441-1.576 1.309-3.648 2.016-5.848 1.813s-4.108-1.278-5.417-2.854-2.016-3.648-1.813-5.848c0.187-2.032 1.117-3.814 2.507-5.106 0.782-0.728 1.71-1.3 2.731-1.672-0.456 1.264-0.577 2.606-0.384 3.899 0.303 2.023 1.38 3.934 3.156 5.247 1.578 1.167 3.448 1.668 5.272 1.545 0.752-0.050 1.496-0.207 2.21-0.465z"
				></path>
			</svg>
		{:else if theme === 'light'}
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Light</title>
				<path
					d="M18 12c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243 0.673 3.158 1.757 4.243 2.586 1.757 4.243 1.757 3.158-0.673 4.243-1.757 1.757-2.586 1.757-4.243zM16 12c0 1.105-0.447 2.103-1.172 2.828s-1.723 1.172-2.828 1.172-2.103-0.447-2.828-1.172-1.172-1.723-1.172-2.828 0.447-2.103 1.172-2.828 1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828zM11 1v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 21v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1zM3.513 4.927l1.42 1.42c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.42-1.42c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM17.653 19.067l1.42 1.42c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-1.42-1.42c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM1 13h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM21 13h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1zM4.927 20.487l1.42-1.42c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.42 1.42c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM19.067 6.347l1.42-1.42c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.42 1.42c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"
				></path>
			</svg>
		{:else}
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>System</title>
				<path
					d="M6 5h12c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v12c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-12c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-12c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM9 8c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1zM10 10h4v4h-4zM1 15h2v3c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h4v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-3h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-3h2c0.552 0 1-0.448 1-1s-0.448-1-1-1h-2v-2c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-4v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1h2v3h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1z"
				></path>
			</svg>
		{/if}
	</Button>
	<Toast
		message={$toastMessage}
		close={() => {
			toastMessage.set(null);
			toastActions.set(null);
		}}
	>
		{#snippet footer()}
			{#if $toastActions}
				{#each $toastActions as action}
					<Button size="small" onclick={action.callback}>{action.label}</Button>
				{/each}
			{/if}
		{/snippet}
	</Toast>
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

	:global(.ColorToggle) {
		margin: auto 1rem 2rem auto;
		position: sticky;
		bottom: 2rem;
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
