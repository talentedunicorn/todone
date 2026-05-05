<script lang="ts">
	import { Markdown } from 'carta-md';
	import 'carta-md/default.css';
	import ExportImport from '../components/ExportImport.svelte';
	import { getDocCount } from '../db';
	import { createViewerCarta } from '../lib/carta';

	import content from '../../About.md?raw';

	let complete = $state<number>(0);
	let incomplete = $state<number>(0);

	const carta = createViewerCarta();

	const fetchCount = async () => {
		const { complete: completeSub, incomplete: incompleteSub } = await getDocCount();
		completeSub.subscribe((v: number) => {
			complete = v;
		});
		incompleteSub.subscribe((v: number) => {
			incomplete = v;
		});
	};

	$effect(() => {
		fetchCount();
	});
</script>

<svelte:head>
	<title>About ToDone &#8212; Get it done!</title>
</svelte:head>

<section class="Wrapper">
	<div><Markdown {carta} value={content} /></div>
	<details>
		<summary>Data summary</summary>
		<p>Done &#8212; {complete}</p>
		<p>ToDo &#8212; {incomplete}</p>
		<nav>
			<ExportImport />
		</nav>
	</details>
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

	:global(.carta-md) {
		font-size: 1.2rem;
		line-height: 1.7;
	}

	:global(.carta-md a) {
		color: var(--primary);
	}
</style>
