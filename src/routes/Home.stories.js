import Page from './+page.svelte';

export default {
	title: 'Pages/Home',
	component: Page
};

const Template = (args) => ({
	Component: Page,
	props: args
});

export const Empty = Template.bind({});
