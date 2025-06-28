<script>
	import { title } from '../lib/helpers';
</script>

<svelte:head>
	<title>{title('Not found')}</title>
</svelte:head>

<section>
	<h1>This page does not exist or has moved.</h1>
</section>

<style>
	section {
		padding: 2rem;
	}
</style>
