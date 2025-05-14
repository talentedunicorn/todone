<script lang="ts">
	import { marked } from 'marked';
	import ExportImport from '../components/ExportImport.svelte';
	import { incompleteTodos, completedTodos } from '../stores/todos';

	import content from '../../About.md?raw';
</script>

<svelte:head>
	<title>Dashboard &#8212; Get it done!</title>
</svelte:head>

<section class="Wrapper">
	<div>
		<h2 class="Title">Overview</h2>
		<p>Done &#8212; {$completedTodos.todos.length}</p>
		<p>ToDo &#8212; {$incompleteTodos.todos.length}</p>
		<nav>
			<ExportImport />
		</nav>
	</div>
	<aside>
		<h2>About</h2>
		{@html marked(content)}
	</aside>
</section>

<style>
	.Wrapper {
		padding: 2rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 2rem;

		nav {
			display: inline-flex;
			align-items: flex-start;
			gap: 2rem;
		}
	}
</style>
