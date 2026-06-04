<script module lang="ts">
	import Fab from './Fab.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'Fab',
		component: Fab,
		args: {
			onclick: fn()
		},
		argTypes: {
			visible: { control: 'boolean', default: true }
		}
	});
</script>

<Story name="Visible" args={{ visible: true }} />

<Story name="Hidden" args={{ visible: false }} />
