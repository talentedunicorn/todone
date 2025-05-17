<script lang="ts">
	import { marked } from 'marked';
	import ExportImport from '../components/ExportImport.svelte';
	import { incompleteTodos, completedTodos } from '../stores/todos';

	import content from '../../About.md?raw';
	import Button from '../components/Button.svelte';
	import { push } from 'svelte-spa-router';
</script>

<svelte:head>
	<title>Dashboard &#8212; Get it done!</title>
</svelte:head>

<section class="Wrapper">
	<header>
		<h2 class="Title">Overview</h2>
		<h3>{$completedTodos.todos.length} done &#8212; {$incompleteTodos.todos.length} not done</h3>
		<Button variant="link" onclick={() => push('/')}>View list</Button>
	</header>
	<aside>
		<h2>About</h2>
		{@html marked(content)}
	</aside>
	<nav>
		<ExportImport />
	</nav>
</section>

<style>
	.Wrapper {
		padding: 2rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 4rem;

		nav {
			display: inline-flex;
			align-items: flex-start;
			gap: 2rem;
		}
	}
</style>
