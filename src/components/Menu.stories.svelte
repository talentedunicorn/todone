<script module>
	import Menu from './Menu.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'Menu',
		component: Menu
	});
</script>

{#snippet template(args)}
	<Menu
		{...args}
		menuItems={[{ label: 'ToDo', selected: true }, { label: 'Done' }]}
		goTo={() => {}}
	/>
{/snippet}

<Story
	{template}
	name="Default"
	play={async ({ canvas, userEvent }) => {
		const toggleButton = canvas.getByRole('button');

		await userEvent.click(toggleButton);
		const aboutLink = canvas.getByText('ToDo');
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
