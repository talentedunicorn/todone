<script module lang="ts">
	import SortControl from './SortControl.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect } from 'storybook/test';

	const onChangeSpy = fn();

	const { Story } = defineMeta({
		title: 'SortControl',
		component: SortControl,
		parameters: { layout: 'centered' },
		argTypes: {
			field: { control: 'select', options: ['updated', 'created'] },
			dir: { control: 'select', options: ['asc', 'desc'] }
		},
		args: {
			field: 'updated',
			dir: 'desc',
			onChange: onChangeSpy
		}
	});
</script>

{#snippet template(args)}
	<SortControl {...args} />
{/snippet}

<Story
	name="Default"
	{template}
	play={async ({ canvas, userEvent }) => {
		const select = canvas.getByRole('combobox');
		expect(select.value).toBe('updated-desc');

		await userEvent.selectOptions(select, 'created-asc');
		expect(onChangeSpy).toHaveBeenCalledWith('created', 'asc');
	}}
/>
