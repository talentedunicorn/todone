<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Europa from 'europa';
	import { marked } from 'marked';
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import Link from '@tiptap/extension-link';

	const dispatch = createEventDispatcher();
	const europa = new Europa();
	export let editorValue = '';

	let element: HTMLElement;
	let menuElement: HTMLElement;
	let linkDialog: HTMLDialogElement;
	let editor: Editor;

	export const clear = () => {
		editor.commands.clearContent();
	};

	const handleLinkSubmit = (e: Event) => {
		const form = e.target as HTMLFormElement;
		const fd = new FormData();
		editor.commands.setLink({ href: fd.get('link') as string });
		form.reset();
	};

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				BubbleMenu.configure({
					element: menuElement
				}),
				Link
			],
			content: marked(editorValue),
			onTransaction({ editor: _editor }) {
				editor = _editor;
			},
			onUpdate({ editor }) {
				const htmlContent = editor.getHTML();
				const markdownContent = europa.convert(htmlContent);
				dispatch('change', markdownContent);
			}
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});
</script>

{#if editor}
	<nav class="EditorControls">
		<Button on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			><Icon icon="lucide:heading-1" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			><Icon icon="lucide:heading-2" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			><Icon icon="lucide:heading-3" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
			><Icon icon="lucide:heading-4" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
			><Icon icon="lucide:heading-5" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleBold().run()}
			><Icon icon="lucide:bold" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleItalic().run()}
			><Icon icon="lucide:italic" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleBlockquote().run()}
			><Icon icon="lucide:quote" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleCode().run()}
			><Icon icon="lucide:code" /></Button
		>
		<Button on:click={() => alert('TODO: Implement image')}><Icon icon="lucide:image" /></Button>
		<Button on:click={() => alert('TODO: Implement link')}><Icon icon="lucide:link" /></Button>
		<Button on:click={() => editor.chain().focus().toggleBulletList().run()}
			><Icon icon="lucide:list" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleOrderedList().run()}
			><Icon icon="lucide:list-ordered" /></Button
		>
		<Button on:click={() => dispatch('showMarkdown')}><Icon icon="lucide:square-m" /></Button>
	</nav>
{/if}
<div data-testid="content" bind:this={element}>
	<nav bind:this={menuElement}>
		<Button on:click={() => editor.chain().focus().toggleBold().run()}
			><Icon icon="lucide:bold" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleItalic().run()}
			><Icon icon="lucide:italic" /></Button
		>
		<Button on:click={() => editor.chain().focus().toggleCode().run()}
			><Icon icon="lucide:code" /></Button
		>
		<Button on:click={() => linkDialog.showModal()}><Icon icon="lucide:link" /></Button>
		<Button on:click={() => editor.commands.unsetLink()}><Icon icon="lucide:unlink" /></Button>
	</nav>
</div>

<dialog bind:this={linkDialog} class="LinkDialog">
	<form method="dialog" on:submit={handleLinkSubmit}>
		<div>
			<label for="link">Type or paste a link</label>
			<input type="text" id="link" name="link" />
		</div>
		<Button type="submit" variant="primary">Save</Button>
	</form>
</dialog>

<style>
	.EditorControls {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
	}

	.LinkDialog form,
	.LinkDialog div {
		display: flex;
	}

	.LinkDialog form {
		align-items: end;
		gap: 1rem;
	}

	.LinkDialog div {
		gap: 0.5rem;
		flex-flow: column;
	}

	.LinkDialog label {
		font-weight: bold;
	}
</style>
