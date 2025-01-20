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
	import ToggleTheme from './components/ToggleTheme.svelte';
	import { toastActions, toastMessage } from './stores';

	import { getTodos, getTotalCount, type Todo } from './db';

	let auth0: Auth0Client;
	let wrapper: HTMLElement;
	let total = $state<number>(0);
	let todos = $state<Todo[]>([]);
	let page = $state<number>(0);
	let showCompleted = $state<boolean>(false);
	let limit = $state<number>(Number(import.meta.env.VITE_PAGE_LIMIT));
	let totalPages = $derived(Math.ceil(total / limit));

	let menuItems = $derived(
		tabs.map((item) => ({
			...item,
			selected: item.label === $currentTab
		}))
	);

	let showBackToTop = $state(false);
	currentTab.subscribe((v) => {
		showCompleted = v === 'Done';
		// Reset page on tab change
		page = 0;
	});

	const handleMenu = async (path: string) => {
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

	const loadTotal = async () => {
		const totalCountSub = await getTotalCount(showCompleted);
		totalCountSub.subscribe((t) => {
			total = t;
		});
	};

	const loadTodos = async () => {
		(await getTodos(page, limit, showCompleted)).subscribe((data) => {
			todos = data.map((t) => ({ ...t.toJSON() }));
		});
		await loadTotal();
	};

	const refresh = async () => {
		page = 0;
		await loadTodos();
	};

	const next = async () => {
		page++;
	};

	const previous = async () => {
		if (page > 0) {
			page--;
		}
	};

	const toggleExpand = (id: string, expanded: boolean) => {
		const taskIndex = todos.findIndex((t: Todo) => t.id === id);
		if (taskIndex > -1) {
			todos[taskIndex] = { ...todos[taskIndex], expanded };
		}
	};

	const expandAll = () => {
		todos.forEach((t: Todo) => {
			t.expanded = true;
		});
	};

	const collapseAll = () => {
		todos.forEach((t: Todo) => {
			t.expanded = false;
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
			<Button onclick={() => login(auth0)}>Log in</Button>
			<ToggleTheme />
		</div>
	{:else}
		<aside class="Menu">
			<Menu {menuItems} goTo={handleMenu}>
				<ExportImport />
			</Menu>
		</aside>
		<header class="Header">
			<h1 data-syncing={$status} class="Logo" title="ToDone"><Logo /></h1>

			<ToggleTheme />
		</header>
		<section class="Content">
			{#if $isLoggedin}
				<div class="Profile">
					<img src={$user.picture} alt={$user.nickname} />
					<Button onclick={() => logout(auth0)}>Log out</Button>
				</div>
			{/if}
			{#await loadTodos()}
				<p class="Message">Loading data... 👩🏼‍🔧</p>
			{:then}
				<List
					bind:todos
					{previous}
					{next}
					{expandAll}
					{collapseAll}
					{toggleExpand}
					{totalPages}
					{refresh}
					currentPage={page + 1}
				/>
			{/await}
		</section>
	{/if}
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

		:global(.ColorToggle) {
			margin-left: auto;
		}
	}

	.Menu {
		position: fixed;
		top: 0;
		z-index: 9;
	}

	.Header {
		align-self: flex-end;
		display: flex;
		flex-direction: row-reverse;
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

		img {
			inline-size: 3rem;
			border-radius: 100%;
		}
	}

	.Message {
		font-size: 1.5rem;
		padding: 2rem;
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
