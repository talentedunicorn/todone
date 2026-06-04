<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FlatList from './FlatList.svelte';
	import { fn, expect } from 'storybook/test';

	const editSpy = fn();
	const deleteSpy = fn();
	const statusSpy = fn();

	const { Story } = defineMeta({
		title: 'FlatList',
		component: FlatList,
		parameters: { layout: 'fullscreen' },
		args: {
			onEdit: editSpy,
			onDelete: deleteSpy,
			onStatusChange: statusSpy
		}
	});
</script>

{#snippet template(args)}
	<FlatList {...args} />
{/snippet}

<Story
	name="Default"
	{template}
	args={{
		data: [
			{
				id: '1',
				title: 'Set up CI/CD',
				value: 'Configure GitHub Actions for automated testing and deployment.',
				status: 'todo',
				updated: new Date('2026-06-01').toISOString()
			},
			{
				id: '2',
				title: 'Implement auth flow',
				value: 'OAuth2 with Google and GitHub providers.',
				status: 'in-progress',
				updated: new Date('2026-06-03').toISOString()
			},
			{
				id: '3',
				title: 'Write README',
				value: 'Project overview and setup instructions.',
				status: 'done',
				updated: new Date('2026-05-30').toISOString()
			}
		]
	}}
	play={async ({ canvas, userEvent }) => {
		const badge = canvas.getByText('To Do');
		await userEvent.click(badge);
		expect(statusSpy).toHaveBeenCalledWith('1', 'in-progress');
	}}
/>

<Story
	name="Empty"
	{template}
	args={{ data: [] }}
	play={async ({ canvas }) => {
		const emptyMsg = canvas.getByText(/No tasks yet/);
		expect(emptyMsg).toBeInTheDocument();
	}}
/>

<Story
	name="Single item"
	{template}
	args={{
		data: [
			{
				id: '1',
				title: 'Quick task',
				value: 'A single task to do.',
				status: 'todo',
				updated: new Date('2026-06-01').toISOString()
			}
		]
	}}
/>

<Story
	name="Many items"
	{template}
	args={{
		data: Array.from({ length: 15 }, (_, i) => ({
			id: String(i + 1),
			title: `Task ${i + 1}`,
			value: `Description for task ${i + 1}.`,
			status: (['todo', 'in-progress', 'done'] as const)[i % 3],
			updated: new Date(2026, 5, i + 1).toISOString()
		}))
	}}
	play={async ({ canvas }) => {
		expect(canvas.getByText('Task 15')).toBeInTheDocument();
		expect(canvas.getAllByRole('button', { name: /edit/i }).length).toBeGreaterThanOrEqual(10);
	}}
/>
