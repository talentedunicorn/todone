<script lang="ts">
	import { fly } from 'svelte/transition';

	interface Props {
		onclick: () => void;
		visible: boolean;
	}

	let { onclick, visible }: Props = $props();
</script>

{#if visible}
	<button
		class="Fab"
		{onclick}
		aria-label="New task"
		title="New task"
		transition:fly={{ duration: 300, y: 20 }}
	>
		<svg
			width="28"
			height="28"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	</button>
{/if}

<style>
	.Fab {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		z-index: 50;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--primary, #3b82f6);
		color: white;
		border: none;
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.25),
			0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background 0.2s,
			transform 0.2s,
			box-shadow 0.2s;
	}

	.Fab:hover {
		background: var(--primary-hover, #2563eb);
		transform: scale(1.1);
		box-shadow:
			0 6px 20px rgba(0, 0, 0, 0.3),
			0 3px 6px rgba(0, 0, 0, 0.15);
	}

	.Fab:active {
		transform: scale(0.95);
	}

	.Fab:focus-visible {
		outline: 3px solid var(--primary, #3b82f6);
		outline-offset: 2px;
	}

	@media (max-width: 640px) {
		.Fab {
			bottom: 1.5rem;
			right: 1.5rem;
			width: 48px;
			height: 48px;
		}
	}
</style>
