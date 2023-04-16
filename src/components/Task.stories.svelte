<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Task from './Task.svelte';
</script>

<Meta title="Task" component={Task} />

<Template let:args>
	<Task {...args} />
</Template>

<Story
	name="Sample"
	args={{
		title: 'Sample task',
		value: 'A **new** task with some _markdown_ text.',
		updated: new Date('2023-01-01 00:00:000')
	}}
/>
