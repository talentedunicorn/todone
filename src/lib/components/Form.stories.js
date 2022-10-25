import Form from './Form.svelte';

export default {
	title: 'Components/Form',
	component: Form,
	argTypes: {
		submit: { action: 'submit' }
	}
};

const Template = (args) => ({
	Component: Form,
	props: args,
	on: {
		submit: args.submit
	}
});

export const Empty = Template.bind({});
Empty.args = {};

export const WithData = Template.bind({});
WithData.args = {
	defaultValue: {
		title: 'Things to do',
		value: '- Write todos in **markdown** \n- Because why not'
	}
};
