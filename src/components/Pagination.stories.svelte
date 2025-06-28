<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Pagination from './Pagination.svelte';

	const { Story } = defineMeta({
		title: 'Pagination',
		component: Pagination,
		args: {
			currentPage: 1,
			totalPages: 10,
			limit: 10,
			onPageChange: () => {},
			onLimitChange: () => {}
		},
		argTypes: {
			currentPage: { control: 'number' },
			totalPages: { control: 'number' },
			limit: { control: 'select', options: [5, 10, 20, 50, 100] }
		}
	});
</script>

{#snippet template(args: any)}
	<Pagination {...args} />
{/snippet}

<Story name="Default" {template} />
