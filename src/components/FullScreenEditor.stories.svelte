<script module lang="ts">
	import FullScreenEditor from './FullScreenEditor.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'FullScreenEditor',
		component: FullScreenEditor,
		args: {
			open: true,
			onClose: fn(),
			onSave: fn()
		},
		argTypes: {
			open: { control: 'boolean', default: true }
		}
	});
</script>

<Story name="New task" args={{ defaultValue: null }} />

<Story
	name="Edit task"
	args={{
		defaultValue: {
			id: '1',
			title: 'Example task',
			value: '# Things to do\n\n- [ ] First item\n- [ ] Second item',
			status: 'todo',
			updated: new Date()
		}
	}}
/>

<Story
	name="With delete"
	args={{
		defaultValue: {
			id: '1',
			title: 'Deletable task',
			value: 'Some content here.',
			status: 'done',
			updated: new Date()
		},
		onDelete: fn()
	}}
/>
