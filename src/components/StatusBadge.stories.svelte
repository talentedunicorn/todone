<script module lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect } from 'storybook/test';

	const onclickSpy = fn();

	const { Story } = defineMeta({
		title: 'StatusBadge',
		component: StatusBadge,
		parameters: { layout: 'centered' },
		argTypes: {
			status: { control: 'select', options: ['todo', 'in-progress', 'done'] }
		},
		args: {
			status: 'todo',
			onclick: onclickSpy
		}
	});
</script>

{#snippet template(args)}
	<StatusBadge {...args} />
{/snippet}

<Story
	name="To Do"
	{template}
	args={{ status: 'todo' }}
	play={async ({ canvas, userEvent }) => {
		const badge = canvas.getByRole('button');
		expect(badge.textContent).toBe('To Do');
		await userEvent.click(badge);
		expect(onclickSpy).toHaveBeenCalled();
	}}
/>

<Story name="In Progress" {template} args={{ status: 'in-progress' }} />

<Story name="Done" {template} args={{ status: 'done' }} />

<Story name="Non-clickable" {template} args={{ status: 'todo', onclick: undefined }} />
