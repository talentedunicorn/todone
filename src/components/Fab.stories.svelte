<script module lang="ts">
	import Fab from './Fab.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect } from 'storybook/test';

	const clickSpy = fn();

	const { Story } = defineMeta({
		title: 'Fab',
		component: Fab,
		parameters: { layout: 'centered' },
		argTypes: {
			visible: { control: 'boolean' }
		},
		args: {
			onclick: clickSpy,
			visible: true
		}
	});
</script>

{#snippet template(args)}
	<Fab {...args} />
{/snippet}

<Story
	name="Visible"
	{template}
	play={async ({ canvas, userEvent }) => {
		const btn = canvas.getByRole('button', { name: 'New task' });
		await userEvent.click(btn);
		expect(clickSpy).toHaveBeenCalled();
	}}
/>

<Story name="Hidden" {template} args={{ visible: false }} />
