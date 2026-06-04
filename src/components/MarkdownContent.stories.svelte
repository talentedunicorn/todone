<script module lang="ts">
	import MarkdownContent from './MarkdownContent.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'MarkdownContent',
		component: MarkdownContent,
		argTypes: {
			value: { control: 'text' }
		}
	});
</script>

<Story name="Simple text" args={{ value: 'Hello, **world**!' }} />

<Story
	name="With headings and lists"
	args={{
		value: `# Heading 1

## Heading 2

- List item A
- List item B
- List item C`
	}}
/>

<Story
	name="With code block"
	args={{
		value: '```ts\nconst greeting: string = "Hello";\nconsole.log(greeting);\n```'
	}}
/>

<Story
	name="Table"
	args={{
		value: `| Name  | Status |
|-------|--------|
| CI/CD | ✅ Done |
| Docs  | 🚧 WIP |
| Tests | 📝 Todo |`
	}}
/>

<Story name="Empty" args={{ value: '' }} />
