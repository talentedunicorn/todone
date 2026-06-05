<script module lang="ts">
	import IconX from './IconX.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'IconX',
		component: IconX,
		parameters: { layout: 'centered' }
	});
</script>

<Story name="Default">
	<div
		style="display: flex; align-items: center; justify-content: center; width: fit-content; padding: 0.5rem; background: var(--white); color: var(--black); border-radius: 0.5rem;"
	>
		<IconX />
	</div>
</Story>
