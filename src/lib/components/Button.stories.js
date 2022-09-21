import Button from './Button.svelte';
export default {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		click: { action: 'click' },
		variant: { control: { type: 'select' }, options: ['default', 'primary', 'link'] },
		disabled: { control: 'boolean' },
		selected: { control: 'boolean' },
		size: {
			control: { type: 'select' },
			options: ['default', 'small', 'large']
		}
	}
};

const Template = (args) => ({
	Component: Button,
	props: args,
	on: {
		click: args.click
	}
});

export const Primary = Template.bind({});
Primary.args = {
	variant: 'primary'
};

export const Default = Template.bind({});
Default.args = {
	variant: 'default'
};

export const Link = Template.bind({});
Link.args = {
	variant: 'link'
};

export const Selected = Template.bind({});
Selected.args = {
	variant: 'link',
	selected: true
};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true
};

export const Large = Template.bind({});
Large.args = {
	size: 'large'
};

export const Small = Template.bind({});
Small.args = {
	size: 'small'
};
