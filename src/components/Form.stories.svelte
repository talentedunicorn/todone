<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Form from './Form.svelte';

	const handleSubmit = () => {
		console.log('Submitted form');
	};
	const clear = () => {
		console.log('Clear form');
	};
</script>

<Meta title="Form" component={Form} />

<Template let:args>
	<Form {...args} on:submit={handleSubmit} on:clear={clear} />
</Template>

<Story name="Empty" />

<Story
	name="Filled"
	args={{
		defaultValue: {
			title: 'Things to do',
			value: '- Write todos in **markdown** \n- Because why not'
		}
	}}
/>
