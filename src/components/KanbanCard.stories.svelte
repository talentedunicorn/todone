<script module lang="ts">
	import KanbanCard from './KanbanCard.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'KanbanCard'
	});
</script>

<script lang="ts">
	const baseHandlers = {
		onToggleExpand: fn(),
		onEdit: fn(),
		onDelete: fn(),
		onStatusChange: fn()
	};
</script>

<Story name="Todo">
	<KanbanCard
		task={{
			id: '1',
			title: 'Set up CI/CD',
			value: 'Configure GitHub Actions workflow',
			status: 'todo',
			updated: new Date()
		}}
		expanded={false}
		{...baseHandlers}
	/>
</Story>

<Story name="In progress">
	<KanbanCard
		task={{
			id: '2',
			title: 'Write API docs',
			value: 'Document all endpoints',
			status: 'in-progress',
			updated: new Date()
		}}
		expanded={false}
		{...baseHandlers}
	/>
</Story>

<Story name="Done">
	<KanbanCard
		task={{
			id: '3',
			title: 'Fix login bug',
			value: 'Session timeout reduced',
			status: 'done',
			updated: new Date()
		}}
		expanded={false}
		{...baseHandlers}
	/>
</Story>

<Story name="Expanded">
	<KanbanCard
		task={{
			id: '4',
			title: 'Add dark mode',
			value:
				'# Steps\n\n- [x] Define CSS vars\n- [ ] Update components\n- [ ] Test in dark mode\n\n```css\n:root { --bg: white; }\n```',
			status: 'in-progress',
			updated: new Date()
		}}
		expanded={true}
		{...baseHandlers}
	/>
</Story>
