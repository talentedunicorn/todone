<script module lang="ts">
	import Dialog from './Dialog.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect, userEvent } from 'storybook/test';

	const closeSpy = fn();

	const { Story } = defineMeta({
		title: 'Dialog',
		component: Dialog,
		parameters: { layout: 'fullscreen' },
		argTypes: {
			open: { control: 'boolean' },
			label: { control: 'text' },
			maxWidth: { control: 'text' }
		},
		args: {
			open: true,
			label: 'Dialog Title',
			onClose: closeSpy
		}
	});
</script>

{#snippet content(args)}
	<Dialog {...args}>
		<div style="padding: 1rem 0; font-size: 0.95rem; line-height: 1.6; color: var(--text);">
			<p>This is the dialog content area. Children are rendered here via the snippet slot.</p>
			<p>Click outside, press Escape, or click the close button to dismiss.</p>
		</div>
	</Dialog>
{/snippet}

<Story
	name="Open"
	template={content}
	args={{}}
	play={async ({ canvas }) => {
		expect(await canvas.findByText('Dialog Title')).toBeInTheDocument();
		expect(await canvas.findByText(/This is the dialog content area/)).toBeInTheDocument();
	}}
/>

<Story
	name="With long label"
	template={content}
	args={{
		label:
			'A very long dialog title that should be truncated with an ellipsis because it exceeds the available space in the header'
	}}
/>

<Story
	name="Wide"
	template={content}
	args={{
		label: 'Wide Dialog',
		maxWidth: '48rem'
	}}
/>

<Story
	name="Closed"
	template={content}
	args={{ open: false }}
	play={async ({ canvas }) => {
		expect(canvas.queryByText('Dialog Title')).not.toBeInTheDocument();
	}}
/>

<Story
	name="Close via button"
	template={content}
	args={{}}
	play={async ({ canvas }) => {
		const closeBtn = await canvas.findByLabelText('Close');
		await userEvent.click(closeBtn);
		expect(closeSpy).toHaveBeenCalled();
	}}
/>
