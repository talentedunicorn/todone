import Menu from './Menu.svelte';

export default {
	title: 'Components/Menu',
	component: Menu,
	argTypes: {
		title: { control: 'text' }, 
		menuItems: {
			control: {
				type: null
			}
		}
	},
	parameters: {
		layout: 'fullscreen',
		padded: false
	}
};

const Template = (args) => ({
	Component: Menu,
	props: args
});

export const Tasks = Template.bind({});
Tasks.args = {
	title: 'Tasks',
	menuItems: [{ label: 'ToDo', selected: true }, { label: 'Done' }]
};
