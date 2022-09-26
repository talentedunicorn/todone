<script>
	import { fly } from 'svelte/transition';
	import Logo from '../lib/components/Logo.svelte';
	import Menu from '../lib/components/Menu.svelte';

	let currentTab = 'To Do'
	$: menuItems = [
		{ label: 'To Do' },
		{ label: 'Done' },
	].map((item) => ({...item, selected: item.label === currentTab }));
</script>

<div class="Wrapper">
	<div class="Menu">
		<Menu title="Lists" {menuItems} on:goTo={(event) => { currentTab = event.detail }} />
	</div>
	<h1 class="Logo" title="ToDone"><Logo /></h1>
	<main>
		{#key currentTab}
			<h2 class="Title" in:fly={{ y: -20, duration: 500 }}>{currentTab}</h2>
		{/key}
		<p>Coming soon...</p>
	</main>
</div>

<style>
	.Wrapper {
		min-height: 100vh;
		display: grid;
		row-gap: 2rem;
		grid-template-areas: "menu logo" "content content";
		grid-template-rows: min-content auto;
		grid-template-columns: auto min-content;
		align-items: start;
	}
	
	.Menu,
	.Logo {
		position: sticky;
		top: 0;
	}
	
	.Menu {
		grid-area: menu;
		flex: 1;
		max-height: 100vh;
	}
	
	.Logo {
		grid-area: logo;
		display: inline-block;
		border: var(--border);
		padding: 0.2em;
		border-radius: 0.2em;
		margin: 1rem;
		top: 1rem;
	}
	
	main {
		padding: 0 2rem;
		max-width: 80rem;
		width: 100%;
		margin: 0 auto 4rem;
		display: flex;
		flex-flow: column;
		gap: 2rem;
	}
	
	.Title {
		font-size: clamp(2rem, 5vw, 5rem);
		font-weight: 100;
		margin: 0;
		color: var(--gray);
	}

	@media screen and (min-width: 50rem) {
		.Wrapper {
			grid-template-areas: "menu content logo";
			grid-template-columns: max-content auto min-content;
		}
	}
</style>
