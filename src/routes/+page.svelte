<script>
	import Logo from '../lib/components/Logo.svelte';
	import Menu from '../lib/components/Menu.svelte';

	let menuItems = [
		{ label: 'ToDo', selected: true },
		{ label: 'Done', selected: false }
	];
</script>

<div class="wrapper">
	<header>
		<div class="menu">
			<Menu {menuItems} />
		</div>
		<h1 title="ToDone"><Logo /></h1>
	</header>
	<main>
		<p>Coming soon...</p>
	</main>
</div>

<style>
	.wrapper {
		height: 100vh;
		display: grid;
		grid-template-rows: min-content auto;
	}

	header {
		display: flex;
		align-items: start;
		position: sticky;
		top: 0;
	}
	
	.menu {
		flex: 1;
		max-height: 100vh;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	h1 {
		display: inline-block;
		border: var(--border);
		padding: 0.2em;
		border-radius: 0.2em;
		margin: 1rem;
	}

	main {
		padding: 2rem;
		max-width: 80rem;
		width: 100%;
		margin: 0 auto 4rem;
		display: flex;
		flex-flow: column;
		gap: 2rem;
	}
</style>
