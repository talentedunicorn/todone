<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import { marked, type RendererObject } from 'marked';

	const renderer: RendererObject = {
		table(header, body) {
			const r = new marked.Renderer();
			return `<div class="TableWrapper">${r.table(header, body)}</div>`;
		}
	};

	// Configure marked
	marked.use({
		gfm: true,
		renderer
	});

	const dispatch = createEventDispatcher();

	export let title = '';
	export let value = '';
	export let completed = false;
	export let updated: Date;
	$: completeText = completed ? 'Mark Incomplete' : 'Mark Completed';
	$: formattedTimestamp =
		updated &&
		`Updated ― ${Intl.DateTimeFormat('en-MY', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(updated))}`;
</script>

<section>
	<header data-updated={formattedTimestamp}>
		<h3>{title}</h3>
	</header>
	<div class="Content">
		{@html marked(value)}
	</div>
	<div class="Actions">
		<Button size="small" on:click={() => dispatch('delete')}>Delete</Button>
		<Button size="small" on:click={() => dispatch('edit')}>Edit</Button>
		<Button size="small" variant="primary" on:click={() => dispatch('complete')}
			>{completeText}</Button
		>
	</div>
</section>

<style>
	section {
		padding: 1rem;
		border: 1px solid var(--gray-light);
		border-radius: 0.5em;
		background: var(--white);
	}

	header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		font-size: 1.5rem;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	header::after {
		content: attr(data-updated);
		color: var(--gray);
		font-size: 0.8rem;
		font-weight: bold;
	}

	h3 {
		margin: 0;
	}

	.Actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: end;
		gap: 1rem;
		margin-top: 1rem;
	}

	.Content {
		word-break: break-word;
	}

	.Content :global(ul) {
		margin: 0;
		list-style: none;
		padding-left: 1rem;
	}

	.Content :global(li) {
		border-bottom: 1px dashed var(--gray);
		padding: 0.5rem 0;
	}

	.Content :global(li:last-child) {
		border-bottom: none;
	}

	.Content :global(code) {
		background: var(--black);
		color: var(--white);
		border-radius: 0.2rem;
		padding: 0.2rem 0.3rem;
		display: inline-flex;
	}

	.Content :global(input[type='checkbox']) {
		--checkbox-size: 1rem;
		--chechbox-radius: 0.2rem;
		appearance: none;
		margin: 0 0.5rem 0 0;
		display: inline-flex;
		width: var(--checkbox-size);
		height: var(--checkbox-size);
	}

	.Content :global(input[type='checkbox']::after) {
		content: '';
		background: var(--checkbox-bg, var(--gray-light));
		border: 0.2em solid var(--black);
		border-radius: var(--chechbox-radius);
		width: 100%;
	}

	.Content :global(input[type='checkbox']:checked) {
		--checkbox-bg: var(--primary);
	}

	.Content :global(.TableWrapper) {
		overflow-x: auto;
		border: var(--border);
		border-radius: 1rem;
	}

	.Content :global(table) {
		border-collapse: collapse;
		width: 100%;
	}

	.Content :global(table thead tr) {
		border-bottom: var(--border);
	}

	.Content :global(table tr:nth-child(even)) {
		background: var(--gray-light);
	}

	.Content :global(table th),
	.Content :global(table td) {
		padding: 0.5rem;
	}

	.Content :global(table th:not(:last-child)) {
		border-right: var(--border);
	}

	.Content :global(table th) {
		font-size: 1.2rem;
		white-space: nowrap;
	}

	.Content :global(blockquote) {
		font-size: clamp(2rem, 3rem, 4vmin);
	}

	@media screen and (min-width: 50rem) {
		header {
			justify-content: space-between;
		}
	}
</style>
