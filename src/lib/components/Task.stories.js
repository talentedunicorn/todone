import Task from './Task.svelte';

export default {
	title: 'Components/Task',
	component: Task,
	argTypes: {
		title: { control: 'text' },
		body: { control: 'text' },
		completed: { control: 'boolean' },
		edit: { action: 'edit' },
		delete: { action: 'delete' },
		complete: { action: 'complete' }
	}
};

const Template = (args) => ({
	Component: Task,
	props: args
});

export const Sample = Template.bind({});
Sample.args = {
	title: 'Sample task',
	body: 'A **new** task with some _markdown_ text.',
	updated: new Date()
};
