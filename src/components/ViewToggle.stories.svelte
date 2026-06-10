<script module lang="ts">
	import ViewToggle from './ViewToggle.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect } from 'storybook/test';

	const onToggleSpy = fn();

	const { Story } = defineMeta({
		title: 'ViewToggle',
		component: ViewToggle,
		parameters: { layout: 'centered' },
		args: {
			view: 'list',
			onToggle: onToggleSpy
		}
	});
</script>

{#snippet template(args)}
	<ViewToggle {...args} />
{/snippet}

<Story
	name="Default"
	{template}
	play={async ({ canvas, userEvent }) => {
		const listBtn = canvas.getByRole('radio', { name: 'List' });
		expect(listBtn).toHaveClass('active');

		const kanbanBtn = canvas.getByRole('radio', { name: 'Kanban' });
		await userEvent.click(kanbanBtn);
		expect(onToggleSpy).toHaveBeenCalledWith('kanban');
	}}
/>
