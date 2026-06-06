<script lang="ts">
	interface Props {
		view: 'list' | 'kanban';
		onToggle: (view: 'list' | 'kanban') => void;
	}

	let { view, onToggle }: Props = $props();
</script>

<div class="ViewToggle" role="radiogroup" aria-label="View mode">
	<button
		role="radio"
		aria-checked={view === 'list'}
		class:active={view === 'list'}
		onclick={() => onToggle('list')}
	>
		List
	</button>
	<button
		role="radio"
		aria-checked={view === 'kanban'}
		class:active={view === 'kanban'}
		onclick={() => onToggle('kanban')}
	>
		Kanban
	</button>
</div>

<style>
	.ViewToggle {
		display: flex;
		border: 1px solid var(--gray);
		border-radius: 0.5em;
		overflow: hidden;
	}

	button {
		font-family: var(--font);
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.35em 0.75em;
		border: none;
		background: transparent;
		color: var(--gray);
		cursor: pointer;
		transition: all 0.2s var(--ease);
		white-space: nowrap;
	}

	button:not(:last-child) {
		border-right: 1px solid var(--gray);
	}

	button.active {
		background: var(--primary);
		color: var(--white);
	}

	button:not(.active):hover {
		background: var(--gray-bg);
		color: var(--black);
	}
</style>
