<script module lang="ts">
	import ContentViewDialog from './ContentViewDialog.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect, userEvent } from 'storybook/test';

	const closeSpy = fn();
	const editSpy = fn();
	const deleteSpy = fn();

	let sampleTask = {
		id: '1',
		title: 'Add dark mode',
		value:
			'# Steps\n\n- [x] Define CSS vars\n- [ ] Update components\n- [ ] Test in dark mode\n\n```css\n:root { --bg: white; }\n```\n\n> A blockquote for good measure.',
		status: 'in-progress' as const,
		updated: new Date('2026-06-03')
	};

	const { Story } = defineMeta({
		title: 'ContentViewDialog',
		component: ContentViewDialog,
		parameters: { layout: 'fullscreen' },
		argTypes: {
			open: { control: 'boolean' }
		},
		args: {
			open: true,
			task: sampleTask,
			onClose: closeSpy,
			onEdit: editSpy,
			onDelete: deleteSpy
		}
	});
</script>

{#snippet template(args)}
	<ContentViewDialog {...args} />
{/snippet}

<Story
	name="With content"
	{template}
	args={{}}
	play={async ({ canvas }) => {
		expect(await canvas.findByText('Add dark mode')).toBeInTheDocument();
		expect(await canvas.findByText('Define CSS vars')).toBeInTheDocument();
		expect(await canvas.findByText('Update components')).toBeInTheDocument();
	}}
/>

<Story
	name="No description"
	{template}
	args={{
		task: {
			id: '2',
			title: 'Quick task',
			value: '',
			status: 'todo' as const,
			updated: new Date('2024-01-15').toISOString()
		}
	}}
	play={async ({ canvas }) => {
		expect(await canvas.findByText('No description')).toBeInTheDocument();
	}}
/>

<Story
	name="Edit action"
	{template}
	args={{}}
	play={async ({ canvas }) => {
		const editBtn = await canvas.findByText('Edit');
		await userEvent.click(editBtn);
		expect(editSpy).toHaveBeenCalledWith(sampleTask);
	}}
/>

<Story
	name="Delete action"
	{template}
	args={{}}
	play={async ({ canvas }) => {
		const deleteBtn = await canvas.findByText('Delete');
		await userEvent.click(deleteBtn);
		expect(deleteSpy).toHaveBeenCalledWith(sampleTask);
	}}
/>

<Story
	name="Closed"
	{template}
	args={{ open: false }}
	play={async ({ canvas }) => {
		expect(canvas.queryByText('Add dark mode')).not.toBeInTheDocument();
	}}
/>
