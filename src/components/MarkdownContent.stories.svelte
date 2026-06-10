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
		expect(
			await canvas.findByText((_content, el) => el.textContent.includes('Hello,'), {
				selector: 'p'
			})
		).toBeInTheDocument();
		expect(
			await canvas.findByText((_content, el) => el.textContent.includes('world!'), {
				selector: 'p'
			})
		).toBeInTheDocument();
	}}
/>

<Story
	name="With headings and lists"
	{template}
	args={{
		value: `# Heading 1\n\n## Heading 2\n\n- List item A\n- List item B\n- List item C`
	}}
	play={async ({ canvas }) => {
		expect(await canvas.findByRole('heading', { name: 'Heading 1' })).toBeInTheDocument();
		expect(await canvas.findByRole('heading', { name: 'Heading 2' })).toBeInTheDocument();
		expect(
			await canvas.findByText((_content, el) => el.textContent.includes('List item A'), {
				selector: 'li'
			})
		).toBeInTheDocument();
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
		expect(
			await canvas.findByText((_content, el) => el.textContent.includes('greeting'), {
				selector: 'code'
			})
		).toBeInTheDocument();
	}}
/>

<Story
	name="Table"
	{template}
	args={{
		value: `| Name  | Status |\n|-------|--------|\n| CI/CD | ✅ Done |\n| Docs  | 🚧 WIP |\n| Tests | 📝 Todo |`
	}}
	play={async ({ canvas }) => {
		expect(
			await canvas.findByText((_content, el) => el.textContent.includes('CI/CD'), {
				selector: 'td'
			})
		).toBeInTheDocument();
		expect(
			await canvas.findByText((_content, el) => el.textContent.includes('Done'), { selector: 'td' })
		).toBeInTheDocument();
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
