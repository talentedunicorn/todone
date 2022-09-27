import Page from './+page.svelte';

export default {
	title: 'Pages',
	component: Page
};

const Template = (args: any) => ({
	Component: Page,
	props: args
});

export const Home = Template.bind({});
