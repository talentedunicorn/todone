<script lang="ts">
	import { marked } from 'marked';
	import ExportImport from '../components/ExportImport.svelte';

	import content from '../../About.md?raw';
</script>

<svelte:head>
	<title>About ToDone &#8212; Get it done!</title>
</svelte:head>

<section>
	<div>
		{@html marked(content)}
	</div>

	<div>
		<h2>You own your data</h2>
		<nav>
			<ExportImport />
		</nav>
	</div>
</section>

<style>
	section {
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
