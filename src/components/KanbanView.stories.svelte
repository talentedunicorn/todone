<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import KanbanView from './KanbanView.svelte';
	import { fn, expect, waitFor, within } from 'storybook/test';

	const editSpy = fn();
	const deleteSpy = fn();
	const statusSpy = fn();

	const { Story } = defineMeta({
		title: 'KanbanView',
		component: KanbanView,
		parameters: { layout: 'fullscreen' },
		args: {
			onEdit: editSpy,
			onDelete: deleteSpy,
			onStatusChange: statusSpy
		}
	});
</script>

{#snippet template(args)}
	<KanbanView {...args} />
{/snippet}

<Story
	name="Default"
	{template}
	args={{
		data: [
			{
				id: '1',
				title: 'Set up CI/CD',
				value: 'Configure GitHub Actions for automated testing and deployment.',
				status: 'todo',
				updated: new Date('2026-06-01').toISOString()
			},
			{
				id: '2',
				title: 'Design landing page',
				value: '- Research inspirations\n- Sketch wireframes\n- Build prototype',
				status: 'todo',
				updated: new Date('2026-06-02').toISOString()
			},
			{
				id: '3',
				title: 'Implement auth flow',
				value: 'OAuth2 with Google and GitHub providers.',
				status: 'in-progress',
				updated: new Date('2026-06-03').toISOString()
			},
			{
				id: '4',
				title: 'Add dark mode',
				value: 'Use CSS custom properties for theme switching.',
				status: 'in-progress',
				updated: new Date('2026-06-02').toISOString()
			},
			{
				id: '5',
				title: 'Write README',
				value: 'Project overview, setup instructions, and contribution guide.',
				status: 'done',
				updated: new Date('2026-05-30').toISOString()
			},
			{
				id: '6',
				title: 'Set up ESLint',
				value: 'Standard config with Prettier integration.',
				status: 'done',
				updated: new Date('2026-05-28').toISOString()
			}
		]
	}}
	play={async ({ canvas, userEvent }) => {
		const editButtons = canvas.getAllByRole('button', { name: 'Edit' });
		await userEvent.click(editButtons[0]);
		expect(editSpy).toHaveBeenCalled();
	}}
/>

<Story
	name="Expanded task"
	{template}
	args={{
		data: [
			{
				id: '1',
				title: 'Implement auth flow',
				value: '## Providers\n- Google\n- GitHub\n\nUse Passport.js for strategy management.',
				status: 'in-progress',
				updated: new Date('2026-06-03').toISOString()
			},
			{
				id: '2',
				title: 'Set up CI/CD',
				value: '',
				status: 'todo',
				updated: new Date('2026-06-01').toISOString()
			},
			{
				id: '3',
				title: 'Write README',
				value: 'Project overview.',
				status: 'done',
				updated: new Date('2026-05-30').toISOString()
			}
		]
	}}
	play={async ({ canvas, userEvent }) => {
		const cards = canvas.getAllByRole('listitem');
		const authFlowCard = cards.find(
			(card) => card.textContent && card.textContent.includes('Implement auth flow')
		) as HTMLElement;
		const toggle = within(authFlowCard).getByTestId('toggleExpand');
		await userEvent.click(toggle);
		await waitFor(() => {
			const heading = canvas.getByRole('heading', { name: 'Providers' });
			expect(heading).toBeInTheDocument();
		});
	}}
/>

<Story
	name="Empty"
	{template}
	args={{ data: [] }}
	play={async ({ canvas }) => {
		const columns = canvas.getAllByRole('region');
		expect(columns).toHaveLength(3);
		const emptyMsgs = canvas.getAllByText('No tasks');
		expect(emptyMsgs).toHaveLength(3);
	}}
/>

<Story
	name="Cycle status"
	{template}
	args={{
		data: [
			{
				id: '1',
				title: 'Set up CI/CD',
				value: '',
				status: 'todo',
				updated: new Date('2026-06-01').toISOString()
			}
		]
	}}
	play={async ({ canvas, userEvent }) => {
		const badge = canvas.getByRole('button', { name: 'To Do' });
		await userEvent.click(badge);
		expect(statusSpy).toHaveBeenCalledWith('1', 'in-progress');
	}}
/>

<Story
	name="Many items in To Do"
	{template}
	args={{
		data: Array.from({ length: 12 }, (_, i) => ({
			id: String(i + 1),
			title: `Task ${i + 1}`,
			value: `Description for task ${i + 1}`,
			status: 'todo' as const,
			updated: new Date(2026, 5, i + 1).toISOString()
		}))
	}}
	play={async ({ canvas }) => {
		const column = canvas.getByRole('region', { name: 'To Do' });
		const cards = within(column).getAllByRole('listitem');
		expect(cards).toHaveLength(12);
	}}
/>
