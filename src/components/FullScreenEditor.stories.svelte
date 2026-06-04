<script module lang="ts">
	import FullScreenEditor from './FullScreenEditor.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect } from 'storybook/test';

	const closeSpy = fn();
	const saveSpy = fn();
	const deleteSpy = fn();

	const { Story } = defineMeta({
		title: 'FullScreenEditor',
		component: FullScreenEditor,
		parameters: { layout: 'fullscreen' },
		argTypes: {
			open: { control: 'boolean' },
			defaultValue: { control: 'object' }
		},
		args: {
			open: true,
			onClose: closeSpy,
			onSave: saveSpy
		}
	});
</script>

{#snippet template(args)}
	<FullScreenEditor {...args} />
{/snippet}

<Story
	name="New task"
	{template}
	args={{ defaultValue: null }}
	play={async ({ canvas }) => {
		expect(canvas.getByPlaceholderText('Start something...')).toBeInTheDocument();
	}}
/>

<Story
	name="Edit task"
	{template}
	args={{
		defaultValue: {
			id: '1',
			title: 'Example task',
			value: '# Things to do\n\n- [ ] First item\n- [ ] Second item',
			status: 'todo' as const,
			updated: new Date()
		}
	}}
	play={async ({ canvas }) => {
		expect(canvas.getByDisplayValue('Example task')).toBeInTheDocument();
	}}
/>

<Story
	name="With delete"
	{template}
	args={{
		defaultValue: {
			id: '1',
			title: 'Deletable task',
			value: 'Some content here.',
			status: 'done' as const,
			updated: new Date()
		},
		onDelete: deleteSpy
	}}
	play={async ({ canvas, userEvent }) => {
		const deleteBtn = canvas.getByText('Delete');
		await userEvent.click(deleteBtn);
		expect(deleteSpy).toHaveBeenCalled();
	}}
/>
