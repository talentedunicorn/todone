<script lang="ts">
	import { Markdown } from 'carta-md';
	import 'carta-md/default.css';
	import ExportImport from '../components/ExportImport.svelte';
	import { APP_VERSION } from '../lib/version';
	import { getDocCount } from '../db';
	import { createViewerCarta } from '../lib/carta';

	import content from '../../About.md?raw';

	let todo = $state<number>(0);
	let inProgress = $state<number>(0);
	let done = $state<number>(0);

	const total = $derived(todo + inProgress + done);

	const carta = createViewerCarta();

	const fetchCount = async () => {
		const counts = await getDocCount();
		counts.todo.subscribe((v: number) => {
			todo = v;
		});
		counts.inProgress.subscribe((v: number) => {
			inProgress = v;
		});
		counts.done.subscribe((v: number) => {
			done = v;
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
	<aside>
		<h2>Overview — {total}</h2>
		<p>{todo} &#8212; to do</p>
		<p>{inProgress} &#8212; in progress</p>
		<p>{done} &#8212; done</p>
		<p>Version — {APP_VERSION}</p>
		<nav>
			<ExportImport />
		</nav>
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
