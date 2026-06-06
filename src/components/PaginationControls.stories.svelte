<script module lang="ts">
	import PaginationControls from './PaginationControls.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'PaginationControls',
		component: PaginationControls,
		parameters: { layout: 'centered' },
		argTypes: {
			page: { control: { type: 'number', min: 0 } },
			totalCount: { control: { type: 'number', min: 0 } },
			pageSize: { control: { type: 'number', min: 1 } }
		}
	});
</script>

{#snippet template(args)}
	<PaginationControls {...args} />
{/snippet}

<Story
	name="First page, many results"
	{template}
	args={{ page: 0, totalCount: 87, pageSize: 50 }}
	play={async ({ canvas }) => {
		const info = canvas.getByText('1 — 50 of 87');
		expect(info).toBeInTheDocument();
		const prev = canvas.getByLabelText('Previous page');
		expect(prev).toBeDisabled();
		const next = canvas.getByLabelText('Next page');
		expect(next).not.toBeDisabled();
	}}
/>

<Story
	name="Second page, many results"
	{template}
	args={{ page: 1, totalCount: 87, pageSize: 50 }}
	play={async ({ canvas }) => {
		const info = canvas.getByText('51 — 87 of 87');
		expect(info).toBeInTheDocument();
		const prev = canvas.getByLabelText('Previous page');
		expect(prev).not.toBeDisabled();
		const next = canvas.getByLabelText('Next page');
		expect(next).toBeDisabled();
	}}
/>

<Story
	name="Single page — hidden"
	{template}
	args={{ page: 0, totalCount: 30, pageSize: 50 }}
	play={async ({ canvas }) => {
		const info = canvas.queryByText(/30/);
		expect(info).not.toBeInTheDocument();
	}}
/>

<Story
	name="Exactly one page — hidden"
	{template}
	args={{ page: 0, totalCount: 50, pageSize: 50 }}
	play={async ({ canvas }) => {
		const info = canvas.queryByText(/50/);
		expect(info).not.toBeInTheDocument();
	}}
/>

<Story
	name="Edge case: pageSize+1 items — two pages"
	{template}
	args={{ page: 0, totalCount: 51, pageSize: 50 }}
	play={async ({ canvas }) => {
		const info = canvas.getByText('1 — 50 of 51');
		expect(info).toBeInTheDocument();
		const prev = canvas.getByLabelText('Previous page');
		expect(prev).toBeDisabled();
		const next = canvas.getByLabelText('Next page');
		expect(next).not.toBeDisabled();
	}}
/>

<Story
	name="Empty — hidden"
	{template}
	args={{ page: 0, totalCount: 0, pageSize: 50 }}
	play={async ({ canvas }) => {
		const el = canvas.queryByRole('navigation');
		expect(el).not.toBeInTheDocument();
	}}
/>

<Story
	name="Large page size — all visible, hidden"
	{template}
	args={{ page: 0, totalCount: 87, pageSize: 100 }}
	play={async ({ canvas }) => {
		const info = canvas.queryByText(/87/);
		expect(info).not.toBeInTheDocument();
	}}
/>

<Story
	name="Last page of many"
	{template}
	args={{ page: 9, totalCount: 500, pageSize: 50 }}
	play={async ({ canvas }) => {
		const info = canvas.getByText('451 — 500 of 500');
		expect(info).toBeInTheDocument();
		const prev = canvas.getByLabelText('Previous page');
		expect(prev).not.toBeDisabled();
		const next = canvas.getByLabelText('Next page');
		expect(next).toBeDisabled();
	}}
/>
