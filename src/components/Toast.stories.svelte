<script module>
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

{#snippet template(args)}
	<Toast {...args} />
{/snippet}

{#snippet withFooter(args)}
	<Toast {...args}>
		{#snippet footer()}
			<Button size="small" onclick={() => alert('Shhh... 🥲')}>Show me</Button>
		{/snippet}
	</Toast>
{/snippet}

<Story name="Default" children={template} />

<Story name="With footer action" children={withFooter} />
