<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import { marked, type RendererObject } from 'marked';
	import type { HTMLBaseAttributes } from 'svelte/elements';

	interface $$Props extends HTMLBaseAttributes {
		title: string;
		value: string;
		completed: boolean;
		updated: Date;
	}
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
	let expanded = false;
	$: completeText = completed ? 'Mark Incomplete' : 'Mark Completed';
	$: formattedTimestamp = `Updated ― ${Intl.DateTimeFormat('en-MY', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(updated))}`;

	const scrollToID = (ev: MouseEvent) => {
		ev.preventDefault();
		const el = ev.currentTarget as HTMLLinkElement;
		const id = el.getAttribute('href')?.slice(0);
		const scrollTo = document.querySelector(id!);

		scrollTo?.scrollIntoView({ behavior: 'smooth' });
	};

	const scrollIntoView = (el: HTMLAnchorElement) => {
		el.addEventListener('click', scrollToID);

		return {
			destroy: () => el.removeEventListener('click', scrollToID)
		};
	};
</script>

<section {...$$restProps}>
	<header data-updated={formattedTimestamp}>
		<h3>{title}</h3>
	</header>
	<div data-testid="content" class="Content" class:expanded>
		{@html marked(value)}
	</div>
	<div class="Actions">
		<Button
			data-testid="toggleExpand"
			data-toggle
			size="small"
			variant="link"
			on:click={() => {
				expanded = !expanded;
			}}
		>
			<a href={`#${$$restProps.id}`} use:scrollIntoView>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" fill="currentColor">
					{#if expanded}
						<path
							d="M18.707 14.293l-6-6c-0.391-0.391-1.024-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
						/>
					{:else}
						<path
							d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"
						/>
					{/if}
				</svg>
			</a>
		</Button>
		<Button data-testid="delete" size="small" on:click={() => dispatch('delete')}>Delete</Button>
		<Button data-testid="edit" size="small" on:click={() => dispatch('edit')}>Edit</Button>
		<Button
			data-testid="complete"
			size="small"
			variant="primary"
			on:click={() => dispatch('complete')}>{completeText}</Button
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
	}

	.Actions :global([data-toggle]) {
		margin-right: auto;
		padding: 0;
	}

	.Actions :global([data-toggle] a) {
		color: inherit;
	}

	.Content {
		word-break: break-word;
		max-height: var(--content-height, 3rem);
		overflow: clip;
		position: relative;
		transition: max-height 0.2s ease-in;
		margin: 1rem 0;
	}

	.Content::after {
		position: absolute;
		content: '';
		inset: 0;
		visibility: var(--content-gradient-visibility, visible);
		opacity: var(--content-gradient-opacity, 1);
		background: linear-gradient(to bottom, transparent 20%, var(--white));
	}

	.expanded {
		--content-height: 100%;
		--content-gradient-visibility: hidden;
		--content-gradient-opacity: 0;
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
