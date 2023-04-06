<script>
	import '../app.css';
	import Logo from '$lib/components/Logo.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import { PUBLIC_SYNCED, PUBLIC_GA_TAG } from '$env/static/public';
	import { isLoggedin, tabs, currentTab, status } from '../stores';
	import Button from '$lib/components/Button.svelte';
	import { checkAuth, login } from '$lib/auth';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	/**
	 * @type {HTMLElement}
	 */
	let wrapper;

	$: menuItems = tabs.map((item) => ({
		...item,
		selected: item.label === $currentTab
	}));

	let showBackToTop = false;

	const handleMenu = (/** @type {import('svelte').ComponentEvents<Menu>['goTo']} */ value) => {
		currentTab.set(value.detail);
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
		if (PUBLIC_SYNCED === 'true') {
			await checkAuth();
			if (!$isLoggedin) return;
		}
	});
</script>

<svelte:head>
	<title>ToDone &#8212; Get it done!</title>
	<meta name="description" content="An offline-first ToDo list" />
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GA_TAG}"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', '{PUBLIC_GA_TAG}');
	</script>
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
		<header class="Header">
			<h1 data-syncing={$status} class="Logo" title="ToDone"><Logo /></h1>
		</header>
		<section class="Content">
			<slot />
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

	.Footer {
		align-self: flex-end;
		position: sticky;
		bottom: 2rem;
		padding: 0 1rem 0 0;
		display: flex;
		justify-content: flex-end;
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
