<script lang="ts">
	import type { Auth0Client } from '@auth0/auth0-spa-js';

	import List from '../List.svelte';
	import Button from '../components/Button.svelte';
	import Menu from '../components/Menu.svelte';
	import { isLoggedin, tabs, currentTab, user } from '../stores';
	import { logout } from '../auth';
	import { Link } from 'svelte-routing';

	const { auth0 } = $props<{ auth0: Auth0Client | undefined }>();
	let menuItems = $derived(
		tabs.map((item) => ({
			...item,
			selected: item.label === $currentTab
		}))
	);

	const handleMenu = (path: string) => {
		currentTab.set(path);
	};
</script>

<svelte:head>
	<title>ToDone &#8212; Get it done!</title>
</svelte:head>

<aside class="Menu">
	<Menu {menuItems} goTo={handleMenu}>
		<Link to="/about"><Button size="large" variant="link">About ToDone</Button></Link>
	</Menu>
</aside>
<section class="Content">
	{#if $isLoggedin}
		<div class="Profile">
			<img src={$user.picture} alt={$user.nickname} />
			<Button onclick={() => logout(auth0)}>Log out</Button>
		</div>
	{/if}
	<List />
</section>

<style>
	.Menu {
		position: fixed;
		top: 0;
		z-index: 9;
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
</style>
