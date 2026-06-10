<script lang="ts">
	import type { TaskStatus } from '../domain/todo';

	interface Props {
		status: TaskStatus;
		onclick?: () => void;
	}

	let { status, onclick }: Props = $props();

	const statusColors: Record<string, string> = {
		todo: 'var(--gray, #9ca3af)',
		'in-progress': 'var(--yellow, #eab308)',
		done: 'var(--green, #22c55e)'
	};

	const statusLabels: Record<string, string> = {
		todo: 'To Do',
		'in-progress': 'In Progress',
		done: 'Done'
	};
</script>

<button
	class="status-badge"
	style="--badge-color: {statusColors[status] || statusColors.todo}"
	{onclick}
	title={statusLabels[status]}
>
	{statusLabels[status]}
</button>

<style>
	.status-badge {
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.2em 0.6em;
		border-radius: 999px;
		border: 1px solid var(--badge-color, var(--gray));
		color: var(--badge-color, var(--gray));
		background: transparent;
		cursor: pointer;
		transition: background 0.15s;
		white-space: nowrap;
	}

	.status-badge:hover {
		background: color-mix(in srgb, var(--badge-color, var(--gray)) 10%, transparent);
	}
</style>
