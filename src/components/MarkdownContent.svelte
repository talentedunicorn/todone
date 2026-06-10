<script lang="ts">
	import { Markdown, type Carta } from 'carta-md';
	import 'carta-md/default.css';
	import { createViewerCarta } from '../lib/carta';
	import { themeObserver } from '../lib/theme-observer';

	interface Props {
		value: string;
	}

	let { value }: Props = $props();

	let cartaInstance = $state<Carta | null>(null);
</script>

<div
	class="md-body"
	use:themeObserver={{
		createInstance: (theme) => createViewerCarta({ theme, enableCodeHighlighting: true }),
		onUpdate: (c: Carta) => (cartaInstance = c)
	}}
>
	{#if cartaInstance}
		{#key `${value}-${cartaInstance}`}
			<Markdown carta={cartaInstance} {value} />
		{/key}
	{/if}
</div>

<style>
	.md-body {
		:global(.shiki) {
			background: var(--gray-light);
			padding: 0.5rem;
			border-radius: 0.25rem;
			overflow-x: auto;
		}

		:global(pre) {
			overflow-x: auto;
			max-width: 100%;
		}

		:global(img) {
			max-width: 100%;
			height: auto;
			border-radius: 0.25rem;
		}

		:global(table) {
			border-collapse: collapse;
			width: 100%;
			overflow-x: auto;
			display: block;
			max-width: 100%;
		}

		:global(th),
		:global(td) {
			border: 1px solid var(--gray-light);
			padding: 0.25rem 0.5rem;
		}

		:global(blockquote) {
			border-left: 3px solid var(--gray-light);
			margin-left: 0;
			padding-left: 1rem;
			color: var(--gray);
		}
	}
</style>
