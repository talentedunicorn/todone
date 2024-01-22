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
	section,
	header {
		display: flex;
	}

	section {
		flex-wrap: wrap;
		padding: 1rem;
		border: 1px solid var(--gray-light);
		border-radius: 0.5em;
		gap: 1rem;
		background: var(--white);
	}

	header {
		flex-wrap: wrap;
		justify-content: space-between;
		font-size: 1.5rem;
		gap: 1rem;
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

	header,
	.Actions,
	.Content {
		flex: 100%;
	}

	.Actions {
		display: flex;
		justify-content: end;
		gap: 1rem;
	}

	.Content {
		word-break: break-word;
		display: grid;
		grid-auto-flow: row;
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
	}

	.Content :global(table) {
		--border: 1px dashed var(--gray);
		border-collapse: collapse;
		border-bottom: var(--border);
	}

	.Content :global(table tr) {
		border-top: var(--border);
	}

	.Content :global(table th),
	.Content :global(table td) {
		padding: 1rem;
	}

	.Content :global(table th:not(:last-child)),
	.Content :global(table td:not(:last-child)) {
		border-right: var(--border);
	}

	.Content :global(table th) {
		font-size: 1.3rem;
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
