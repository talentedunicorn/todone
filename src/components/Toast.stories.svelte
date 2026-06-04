<script module lang="ts">
	import Button from './Button.svelte';
	import Toast from './Toast.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';

	const closeSpy = fn();
	const footerSpy = fn();

	const { Story } = defineMeta({
		title: 'Toast',
		component: Toast,
		args: {
			message: 'Test notification',
			close: closeSpy
		}
	});
</script>

{#snippet template(args)}
	<Toast {...args} />
{/snippet}

{#snippet withFooter(args)}
	<Toast {...args}>
		{#snippet footer()}
			<Button size="small" onclick={() => footerSpy()}>Show me</Button>
		{/snippet}
	</Toast>
{/snippet}

<Story name="Default" {template} />

<Story
	name="Long message"
	{template}
	args={{
		message:
			'This is a very long notification message that should wrap across multiple lines to test how the toast handles overflowing text content in the UI.'
	}}
/>

<Story
	name="Error notification"
	{template}
	args={{ message: 'Failed to save task. Please try again.' }}
/>

<Story
	name="With footer action"
	template={withFooter}
	play={async ({ canvas, userEvent }) => {
		const button = canvas.getByRole('button', { name: 'Show me' });
		await userEvent.click(button);
		expect(footerSpy).toHaveBeenCalled();
	}}
/>
