<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	const { Story } = defineMeta({ title: 'Docs/WYSIWYG MVP', component: null as any });
</script>

<Story name="Plan">
	<div style="padding: 1rem; border: 1px solid var(--gray-light); border-radius: 0.5rem;">
		<h4>WYSIWYG MVP Plan</h4>
		<p>
			Minimal MVP for a toolbar-based WYSIWYG editor for the form body (markdown). The MVP uses
			text-labeled buttons above the content textarea. Keyboard shortcuts are tracked as tech debt
			and will be implemented in a future sprint.
		</p>
		<ul>
			<li>
				Actions: Bold, Italic, Heading, Inline Code, Code Block, Bulleted List, Numbered List,
				Checklist, Link
			</li>
			<li>
				Behavior: wrap selection with markdown tokens or insert placeholders when no selection
			</li>
			<li>Storage remains as markdown text in Todo.value</li>
			<li>Docs note: full details in plans/WYSIWYG_MVP_plan.md</li>
		</ul>
	</div>
</Story>
