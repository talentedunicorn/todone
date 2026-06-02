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
		const editButtons = canvas.getAllByRole('button', { name: 'Edit' });
		await userEvent.click(editButtons[0]);
		expect(editSpy).toHaveBeenCalled();
	}}
/>

<Story
	name="With expanded task"
	{template}
	args={{
		data: [
			{
				id: '1',
				title: 'Implement auth flow',
				value:
					'## Steps\n1. Set up Passport.js\n2. Configure Google strategy\n3. Add GitHub OAuth\n\nRefer to the [docs](https://example.com) for details.',
				status: 'in-progress',
				updated: new Date('2026-06-03').toISOString()
			},
			{
				id: '2',
				title: 'Set up CI/CD',
				value: '',
				status: 'todo',
				updated: new Date('2026-06-01').toISOString()
			}
		]
	}}
	play={async ({ canvas, userEvent }) => {
		const taskItem = canvas.getByText('Implement auth flow');
		await userEvent.click(taskItem);
		const heading = canvas.getByText('Steps');
		expect(heading).toBeInTheDocument();
	}}
/>

<Story
	name="Cycle status"
	{template}
	args={{
		data: [
			{
				id: '1',
				title: 'Set up CI/CD',
				value: '',
				status: 'todo',
				updated: new Date('2026-06-01').toISOString()
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
