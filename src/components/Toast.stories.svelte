<script module lang="ts">
	import Button from './Button.svelte';
	import Toast from './Toast.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Toast',
		component: Toast,
		args: {
			message: 'Test notification',
			close: () => console.log('Closing toast')
		}
	});
</script>

{#snippet template(args: any)}
	<Toast {...args} />
{/snippet}

{#snippet withFooter(args: any)}
	<Toast {...args}>
		{#snippet footer()}
			<Button size="small" onclick={() => alert('Shhh... 🥲')}>Show me</Button>
		{/snippet}
	</Toast>
{/snippet}

<Story name="Default" {template} />

<Story name="With footer action" template={withFooter} />
