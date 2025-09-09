<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Search from './Search.svelte';

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
	play={async ({ canvas, userEvent }) => {
		const showButton = canvas.getByTestId('showSearch');

		await userEvent.click(showButton);

		const hideButton = canvas.getByTestId('hideSearch');
		const input = canvas.getByTestId('input');
		expect(hideButton).toBeVisible();
		expect(input).toBeVisible();

		await userEvent.click(hideButton);

		expect(canvas.getByTestId('showSearch')).toBeVisible();
	}}
/>

<Story {template} name="With value" args={{ query: 'Test' }} />
