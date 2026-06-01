<script lang="ts">
	import type { Todo, TaskStatus } from '../domain/todo';
	import KanbanColumn from './KanbanColumn.svelte';
	import { expandedTasks } from '../stores';

	interface Props {
		data: Todo[];
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
		onStatusChange: (id: string, status: TaskStatus) => void;
	}

	let { data, onEdit, onDelete, onStatusChange }: Props = $props();

	let collapsedColumns = $state(new Set<string>());

	const toggleCollapse = (key: string) => {
		const next = new Set(collapsedColumns);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		collapsedColumns = next;
	};

	let todoTasks = $derived(data.filter((t) => t.status === 'todo'));
	let inProgressTasks = $derived(data.filter((t) => t.status === 'in-progress'));
	let doneTasks = $derived(data.filter((t) => t.status === 'done'));

	const dropOnColumn = (e: DragEvent, status: TaskStatus) => {
		const taskId = e.dataTransfer?.getData('text/plain');
		if (taskId) onStatusChange(taskId, status);
	};

	const handleToggleExpand = (id: string, expanded: boolean) => {
		expandedTasks.update((set) => {
			if (expanded) set.add(id);
			else set.delete(id);
			return new Set(set);
		});
	};

	const clearDone = () => {
		for (const task of doneTasks) {
			onDelete(task);
		}
	};
</script>

<div class="kanban">
	<KanbanColumn
		title="To Do"
		status="todo"
		tasks={todoTasks}
		collapsed={collapsedColumns.has('todo')}
		onToggleCollapse={() => toggleCollapse('todo')}
		expandedTasks={$expandedTasks}
		onToggleExpand={handleToggleExpand}
		{onEdit}
		{onDelete}
		{onStatusChange}
		ondragover={(e) => e.preventDefault()}
		ondrop={(e) => dropOnColumn(e, 'todo')}
	/>
	<KanbanColumn
		title="In Progress"
		status="in-progress"
		tasks={inProgressTasks}
		collapsed={collapsedColumns.has('in-progress')}
		onToggleCollapse={() => toggleCollapse('in-progress')}
		expandedTasks={$expandedTasks}
		onToggleExpand={handleToggleExpand}
		{onEdit}
		{onDelete}
		{onStatusChange}
		ondragover={(e) => e.preventDefault()}
		ondrop={(e) => dropOnColumn(e, 'in-progress')}
	/>
	<KanbanColumn
		title="Done"
		status="done"
		tasks={doneTasks}
		collapsed={collapsedColumns.has('done')}
		onToggleCollapse={() => toggleCollapse('done')}
		expandedTasks={$expandedTasks}
		onToggleExpand={handleToggleExpand}
		{onEdit}
		{onDelete}
		{onStatusChange}
		onClear={doneTasks.length > 0 ? clearDone : undefined}
		clearLabel="Clear done"
		ondragover={(e) => e.preventDefault()}
		ondrop={(e) => dropOnColumn(e, 'done')}
	/>
</div>

<style>
	.kanban {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	@media (max-width: 60rem) {
		.kanban {
			grid-template-columns: 1fr;
		}
	}
</style>
