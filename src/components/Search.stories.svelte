<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Search from './Search.svelte';
	import { expect, userEvent, waitFor, within } from '@storybook/test';

	const { Story } = defineMeta({
		title: 'Search',
		component: Search
	});
</script>

{#snippet template(args: any)}
	<Search {...args} />
{/snippet}

<Story
	{template}
	name="Empty"
	play={({ canvasElement }) => {
		const canvas = within(canvasElement);
		const showButton = canvas.getByTestId('showSearch');

		userEvent.click(showButton);
		waitFor(() => {
			const hideButton = canvas.getByTestId('hideSearch');
			const input = canvas.getByTestId('input');
			expect(hideButton).toBeVisible();
			expect(input).toBeVisible();

			userEvent.click(hideButton);
		});

		waitFor(() => {
			expect(showButton).toBeVisible();
		});
	}}
/>

<Story {template} name="With value" args={{ query: 'Test' }} />
