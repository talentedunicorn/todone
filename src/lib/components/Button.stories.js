import Button from './Button.svelte';
export default {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		label: { control: 'text' },
		onClick: { action: 'onClick' },
		variant: { control: { type: 'select' }, options: ['default', 'primary', 'link'] },
		disabled: { control: 'boolean' },
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
		click: args.onClick
	}
});

export const Primary = Template.bind({});
Primary.args = {
	variant: 'primary',
	label: 'Button'
};

export const Default = Template.bind({});
Default.args = {
	label: 'Button',
	variant: 'default'
};

export const Link = Template.bind({});
Link.args = {
	label: 'Button',
	variant: 'link'
};

export const Disabled = Template.bind({});
Disabled.args = {
	label: 'Disabled',
	disabled: true
};

export const Large = Template.bind({});
Large.args = {
	size: 'large',
	label: 'Button'
};

export const Small = Template.bind({});
Small.args = {
	size: 'small',
	label: 'Button'
};
