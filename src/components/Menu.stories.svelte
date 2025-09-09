<script module lang="ts">
	import Menu from './Menu.svelte';
	import Button from './Button.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	const { Story } = defineMeta({
		title: 'Menu',
		component: Menu
	});
</script>

{#snippet template(args: any)}
	<Menu {...args}>
		<Button variant="link">About us</Button>
	</Menu>
{/snippet}

<Story
	{template}
	name="Default"
	play={async ({ canvas, userEvent }) => {
		const toggleButton = canvas.getByRole('button');

		await userEvent.click(toggleButton);
		const aboutLink = canvas.getByText('About us');
		expect(aboutLink).toBeInTheDocument();
		await userEvent.click(toggleButton);
	}}
/>

<Story
	{template}
	name="With title"
	args={{ title: 'Tasks' }}
	play={async ({ canvas, userEvent }) => {
		const toggleButton = canvas.getByRole('button');
		await userEvent.click(toggleButton);

		expect(canvas.getByTestId('header').textContent).toBe('Tasks');
	}}
/>
