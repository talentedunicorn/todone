<script lang="ts">
	import Button from './Button.svelte';
	import { marked, Parser, Renderer, type Tokens } from 'marked';
	import hljs from 'highlight.js';
	import { toastActions, toastMessage } from '../stores';

	marked.use({
		gfm: true
	});
	const originalRenderer = new Renderer();
	originalRenderer.parser = new Parser();

	const tableExtension = {
		renderer: {
			table(token: Tokens.Table) {
				return `<div class="TableWrapper">${originalRenderer.table(token)}</div> `;
			}
		}
	};

	marked.use(tableExtension);

	interface Props {
		title: string;
		value: string;
		completed: boolean;
		updated: Date;
		expanded?: boolean;
		onToggleExpand: (expanded: boolean) => void;
		onDelete: () => void;
		onComplete: () => void;
		onEdit: () => void;
		[key: string]: any;
	}

	const {
		title = '',
		value = '',
		completed = false,
		updated,
		expanded = false,
		onToggleExpand,
		onDelete,
		onComplete,
		onEdit,
		...rest
	}: Props = $props();
	const completeText = $derived(completed ? 'Mark Incomplete' : 'Mark Completed');
	const formattedTimestamp = $derived(
		`Updated ― ${Intl.DateTimeFormat('en-MY', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(updated))}`
	);

	const scrollToID = (ev: MouseEvent) => {
		ev.preventDefault();
		const offset = document.querySelector('.Menu')?.getBoundingClientRect().height ?? 0; // Set offset so menu doesn't cover the task
		const el = ev.currentTarget as HTMLLinkElement;
		const id = el.getAttribute('href')?.slice(0);
		const target = document.querySelector(id!);
		const bodyPosition = document.body.getBoundingClientRect().top;
		const targetPosition = target?.getBoundingClientRect().top ?? 0;

		const top = targetPosition - bodyPosition - offset;

		// Wait for CSS expanded class to be applied
		setTimeout(() => {
			window.scrollTo({ top, behavior: 'smooth' });
		}, 300);
	};

	const scrollIntoView = (el: HTMLAnchorElement) => {
		el.addEventListener('click', scrollToID);

		return {
			destroy: () => el.removeEventListener('click', scrollToID)
		};
	};

	$effect(() => {
		if (title || value) {
			hljs.highlightAll();
		}
	});
</script>

<section {...rest}>
	<header data-updated={formattedTimestamp}>
		<div class="Title">
			<h3>{title}</h3>
			<Button
				data-testid="toggleExpand"
				data-toggle
				size="small"
				variant="link"
				onclick={() => onToggleExpand(!expanded)}
			>
				<a href={`#${rest.id}`} use:scrollIntoView>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						fill="currentColor"
					>
						{#if expanded}
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m6 15l6-6l6 6"
							/>
						{:else}
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m9 6l6 6l-6 6"
							/>
						{/if}
					</svg>
				</a>
			</Button>
		</div>
	</header>
	<div data-testid="content" class="Content" class:expanded>
		{@html marked(value)}
	</div>
	<div class="Actions">
		<Button
			data-testid="delete"
			data-umami-event="Delete task"
			size="small"
			onclick={() => {
				toastActions.set([
					{
						label: 'Yes',
						callback: () => {
							onDelete();
							toastMessage.set(null);
							toastActions.set(null);
						}
					}
				]);
				toastMessage.set(`Delete "${title}"?`);
			}}>Delete</Button
		>
		<Button data-testid="edit" data-umami-event="Edit task" size="small" onclick={onEdit}
			>Edit</Button
		>
		<Button
			data-testid="complete"
			data-umami-event="Toggle complete"
			size="small"
			variant="primary"
			onclick={onComplete}>{completeText}</Button
		>
	</div>
</section>

<style>
	section {
		padding: 1rem;
		border: 1px solid var(--gray-light);
		border-radius: 1rem;
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

	.Title {
		display: inline-flex;
		align-items: flex-start;
		gap: 0.5rem;

		& :global([data-toggle]) {
			order: -1;
			padding-left: 0;
		}

		& :global([data-toggle] a) {
			color: inherit;
		}
	}

	.Actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: end;
		gap: 1rem;
	}

	.Content {
		word-break: break-word;
		max-height: var(--content-height, 3rem);
		overflow: clip;
		position: relative;
		transition: max-height 0.2s ease-in;
		margin: 1rem 0;

		&::after {
			position: absolute;
			content: '';
			inset: 0;
			visibility: var(--content-gradient-visibility, visible);
			opacity: var(--content-gradient-opacity, 1);
			background: linear-gradient(to bottom, transparent 20%, var(--white));
		}

		&.expanded {
			--content-height: 100%;
			--content-gradient-visibility: hidden;
			--content-gradient-opacity: 0;
		}

		:global(pre) {
			font-size: 1rem;
			border-radius: 0.5rem;
			overflow: auto;
		}

		:global(code) {
			display: inline-block;
			padding: 0.3rem;
		}

		:global(.hljs) {
			border-radius: 0.5rem;
			padding: 1rem;
		}

		:global(.TableWrapper) {
			overflow-x: auto;
			border: var(--border);
			border-radius: 1rem;
		}
	}

	@media screen and (min-width: 50rem) {
		header {
			justify-content: space-between;
		}
	}
</style>
