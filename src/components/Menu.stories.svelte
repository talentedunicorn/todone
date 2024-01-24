<script lang="ts" context="module">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import Menu from './Menu.svelte';
	import { userEvent, waitFor, within } from '@storybook/testing-library';
	import { expect } from '@storybook/jest';

	export const meta = {
		title: 'Menu',
		component: Menu
	};
</script>

<Template let:args>
	<Menu
		{...args}
		menuItems={[{ label: 'ToDo', selected: true }, { label: 'Done' }]}
		on:goTo={() => {}}
	/>
</Template>

<Story
	name="Default"
	play={({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggleButton = canvas.getByRole('button');
		const menu = canvas.queryByTestId('menu');

		expect(menu).not.toBeInTheDocument();
		userEvent.click(toggleButton);
		waitFor(function () {
			expect(canvas.getByTestId('menu')).toBeInTheDocument();
			const todoLink = canvas.getByText('ToDo');
			const doneLink = canvas.getByText('Done');

			expect(todoLink.classList).toContain('selected');
			userEvent.click(doneLink);
			expect(menu).not.toBeInTheDocument();
		});
	}}
/>

<Story
	name="With title"
	args={{ title: 'Tasks' }}
	play={({ canvasElement }) => {
		const canvas = within(canvasElement);
		const toggleButton = canvas.getByRole('button');
		userEvent.click(toggleButton);

		waitFor(() => {
			expect(canvas.getByTestId('header').textContent).toBe('Tasks');
		});
	}}
/>
