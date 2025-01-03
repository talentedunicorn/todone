<script lang="ts">
	import { pwaInfo } from 'virtual:pwa-info';
	import Router, { link, push } from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import { fly } from 'svelte/transition';
	import type { Auth0Client } from '@auth0/auth0-spa-js';

	import './app.css';
	import Button from './components/Button.svelte';
	import ReloadPrompt from './components/ReloadPrompt.svelte';
	import Toast from './components/Toast.svelte';
	import Logo from './components/Logo.svelte';
	import ToggleTheme from './components/ToggleTheme.svelte';
	import About from './routes/About.svelte';
	import NotFound from './routes/NotFound.svelte';
	import Login from './routes/Login.svelte';
	import Home from './routes/Home.svelte';
	import { checkAuth, initAuth0Client } from './auth';
	import { toastActions, toastMessage, status, isLoggedin } from './stores';
	import type { ComponentType } from 'svelte';

	let auth0 = $state<Auth0Client>();
	let wrapper: HTMLElement;

	let showBackToTop = $state(false);

	const synced = import.meta.env.VITE_SYNCED === 'true';

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

	const initializeAuth = async () => {
		auth0 = await initAuth0Client();
		await checkAuth(auth0);

		if ($isLoggedin) push(`/`);
	};

	$effect(() => {
		handleBackToTop();
		if (synced && !auth0) initializeAuth();
	});

	const routes = {
		'/about': About,
		'/login': wrap({
			component: Login as unknown as ComponentType,
			props: {
				auth0: () => auth0
			},
			conditions: [
				() => {
					if (!synced) {
						push(`/`);
						return false;
					}
					return true;
				},
				() => {
					if ($isLoggedin) {
						push(`/`);
						return false;
					}
					return true;
				}
			]
		}),
		'/': wrap({
			component: Home as unknown as ComponentType,
			props: {
				auth0: () => auth0
			},
			conditions: [
				() => {
					if (!synced) return true;
					if (!$isLoggedin) {
						push('/login');
						return false;
					}
					return true;
				}
			]
		}),
		'*': NotFound
	};
</script>

<svelte:head>
	{#if import.meta.env.PROD}
		{pwaInfo?.webManifest.linkTag}
	{/if}
</svelte:head>

<main class="Wrapper" bind:this={wrapper}>
	<header class="Header">
		<h1 data-syncing={$status} class="Logo" title="ToDone"><a href="/" use:link><Logo /></a></h1>

		<ToggleTheme />
	</header>
	<Router {routes} />
	{#if showBackToTop}
		<footer class="Footer" transition:fly={{ y: 100, duration: 500 }}>
			<Button onclick={scrollToTop}
				><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width={25}>
					<title>Back to top</title>
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m6 15l6-6l6 6"
					/>
				</svg></Button
			>
		</footer>
	{/if}

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
	.Wrapper {
		flex-flow: column;
		display: flex;
		min-height: 100vh;
		.Footer {
			align-self: flex-end;
			position: sticky;
			bottom: 2rem;
			padding: 0 1rem 0 0;
			display: flex;
			justify-content: flex-end;
		}

		.Header {
			align-self: flex-end;
			display: flex;
			gap: 2rem;
			flex-direction: row-reverse;
			padding-top: 1rem;
		}
	}

	.Logo {
		margin: 1rem;
		padding: 0.2em;
		background: var(--white);
		position: relative;
		&[data-syncing] {
			--indicator-color: var(--primary);
		}

		&[data-syncing]:not([data-syncing='NOT_SYNCED'])::after {
			content: '';
			width: 0.5em;
			height: 0.5em;
			border-radius: 100%;
			background: var(--indicator-color);
			position: absolute;
			top: -0.2em;
			left: -0.2em;
		}

		&[data-syncing='ERROR'] {
			--indicator-color: var(--red);
		}
	}
</style>
