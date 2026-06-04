<script module lang="ts">
	import Icon from './Icon.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Icon'
	});
</script>

<Story name="Sizes">
	<div style="display: flex; align-items: center; gap: 2rem; padding: 1rem;">
		<Icon size={16} strokeWidth={2}>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={24} strokeWidth={2}>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={32} strokeWidth={2}>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={48} strokeWidth={2}>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
	</div>
</Story>

<Story name="Stroke widths">
	<div style="display: flex; align-items: center; gap: 2rem; padding: 1rem;">
		<Icon size={32} strokeWidth={1}>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={32} strokeWidth={2}>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={32} strokeWidth={3}>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
	</div>
</Story>

<Story name="Custom color">
	<div style="display: flex; align-items: center; gap: 2rem; padding: 1rem;">
		<Icon size={32} color="red">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={32} color="green">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={32} color="blue">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
	</div>
</Story>
