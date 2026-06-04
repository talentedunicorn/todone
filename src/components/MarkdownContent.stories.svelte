<script module lang="ts">
	import MarkdownContent from './MarkdownContent.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'MarkdownContent',
		component: MarkdownContent,
		argTypes: {
			value: { control: 'text' }
		}
	});
</script>

{#snippet template(args)}
	<MarkdownContent {...args} />
{/snippet}

<Story
	name="Simple text"
	{template}
	args={{ value: 'Hello, **world**!' }}
	play={async ({ canvas }) => {
		expect(canvas.getByText('Hello,')).toBeInTheDocument();
		expect(canvas.getByText('world!')).toBeInTheDocument();
	}}
/>

<Story
	name="With headings and lists"
	{template}
	args={{
		value: `# Heading 1\n\n## Heading 2\n\n- List item A\n- List item B\n- List item C`
	}}
	play={async ({ canvas }) => {
		expect(canvas.getByRole('heading', { name: 'Heading 1' })).toBeInTheDocument();
		expect(canvas.getByRole('heading', { name: 'Heading 2' })).toBeInTheDocument();
		expect(canvas.getByText('List item A')).toBeInTheDocument();
	}}
/>

<Story
	name="With code block"
	{template}
	args={{
		value: '```ts\nconst greeting: string = "Hello";\nconsole.log(greeting);\n```'
	}}
	play={async ({ canvas }) => {
		// Code blocks render inside <code> or <pre> elements
		expect(canvas.getByText('greeting')).toBeInTheDocument();
	}}
/>

<Story
	name="Table"
	{template}
	args={{
		value: `| Name  | Status |\n|-------|--------|\n| CI/CD | ✅ Done |\n| Docs  | 🚧 WIP |\n| Tests | 📝 Todo |`
	}}
	play={async ({ canvas }) => {
		expect(canvas.getByText('CI/CD')).toBeInTheDocument();
		expect(canvas.getByText('Done')).toBeInTheDocument();
	}}
/>

<Story
	name="Empty"
	{template}
	args={{ value: '' }}
	play={async ({ canvas }) => {
		expect(canvas.queryByText('Hello')).not.toBeInTheDocument();
	}}
/>
