<script module>
	import Form from './Form.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'Form/WYSIWYG Toolbar',
		component: Form
	});
</script>

{#snippet template(args)}
	<Form {...args} onSubmit={() => {}} onClear={() => {}} onUpdate={() => {}} />
{/snippet}

<Story
	{template}
	name="Bold inserts markdown"
	args={{ defaultValue: { title: 'Test', value: 'hello world' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const boldBtn = canvas.getByTestId('toolbar-bold');

		contentField.focus();
		contentField.setSelectionRange(0, 5);
		await userEvent.click(boldBtn);

		expect(contentField.value).toBe('**hello** world');
	}}
/>

<Story
	{template}
	name="Italic inserts markdown"
	args={{ defaultValue: { title: 'Test', value: 'test' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const italicBtn = canvas.getByTestId('toolbar-italic');

		contentField.focus();
		contentField.setSelectionRange(0, 4);
		await userEvent.click(italicBtn);

		expect(contentField.value).toBe('*test*');
	}}
/>

<Story
	{template}
	name="Heading inserts prefix"
	args={{ defaultValue: { title: 'Test', value: 'Title' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const headingBtn = canvas.getByTestId('toolbar-heading');

		contentField.focus();
		contentField.setSelectionRange(0, 5);
		await userEvent.click(headingBtn);

		expect(contentField.value).toBe('# Title');
	}}
/>

<Story
	{template}
	name="Inline Code wraps selection"
	args={{ defaultValue: { title: 'Test', value: 'code' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const codeBtn = canvas.getByTestId('toolbar-inlinecode');

		contentField.focus();
		contentField.setSelectionRange(0, 4);
		await userEvent.click(codeBtn);

		expect(contentField.value).toBe('`code`');
	}}
/>

<Story
	{template}
	name="Code Block inserts fenced"
	args={{ defaultValue: { title: 'Test', value: '' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const codeBlockBtn = canvas.getByTestId('toolbar-codeblock');

		await userEvent.click(codeBlockBtn);

		expect(contentField.value).toContain('```markdown');
		expect(contentField.value).toContain('code');
		expect(contentField.value).toContain('```');
	}}
/>

<Story
	{template}
	name="Bulleted List prefixes line"
	args={{ defaultValue: { title: 'Test', value: 'Item' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const ulBtn = canvas.getByTestId('toolbar-ul');

		contentField.focus();
		contentField.setSelectionRange(0, 4);
		await userEvent.click(ulBtn);

		expect(contentField.value).toBe('- Item');
	}}
/>

<Story
	{template}
	name="Numbered List prefixes line"
	args={{ defaultValue: { title: 'Test', value: 'Item' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const olBtn = canvas.getByTestId('toolbar-ol');

		contentField.focus();
		contentField.setSelectionRange(0, 4);
		await userEvent.click(olBtn);

		expect(contentField.value).toBe('1. Item');
	}}
/>

<Story
	{template}
	name="Checklist inserts unchecked"
	args={{ defaultValue: { title: 'Test', value: '' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const checkBtn = canvas.getByTestId('toolbar-check');

		await userEvent.click(checkBtn);

		expect(contentField.value).toBe('- [ ] ');
	}}
/>

<Story
	{template}
	name="Link inserts markdown link"
	args={{ defaultValue: { title: 'Test', value: 'text' } }}
	play={async ({ canvas, userEvent }) => {
		const contentField = canvas.getByTestId('content');
		const linkBtn = canvas.getByTestId('toolbar-link');

		contentField.focus();
		contentField.setSelectionRange(0, 4);
		await userEvent.click(linkBtn);

		expect(contentField.value).toBe('[text](url)');
	}}
/>
