<script module lang="ts">
	import Icon from './Icon.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Icon',
		component: Icon,
		argTypes: {
			size: { control: { type: 'range', min: 8, max: 64, step: 2 } },
			strokeWidth: { control: { type: 'range', min: 0.5, max: 4, step: 0.5 } },
			color: { control: 'color' }
		}
	});
</script>

{#snippet plus(args: Record<string, any>)}
	<Icon
		size={args.size ?? 24}
		strokeWidth={args.strokeWidth ?? 2}
		{...args.color ? { color: args.color, stroke: args.color } : {}}
	>
		<line x1="12" y1="5" x2="12" y2="19" />
		<line x1="5" y1="12" x2="19" y2="12" />
	</Icon>
{/snippet}

<Story name="Playground" template={plus} args={{ size: 24, strokeWidth: 2 }} />

{#snippet sizesGallery()}
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
{/snippet}

<Story name="Sizes" template={sizesGallery} />

{#snippet strokeWidthsGallery()}
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
{/snippet}

<Story name="Stroke widths" template={strokeWidthsGallery} />

{#snippet colorsGallery()}
	<div style="display: flex; align-items: center; gap: 2rem; padding: 1rem;">
		<Icon size={32} strokeWidth={2} color="red" stroke="red">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={32} strokeWidth={2} color="green" stroke="green">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
		<Icon size={32} strokeWidth={2} color="blue" stroke="blue">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</Icon>
	</div>
{/snippet}

<Story name="Custom color" template={colorsGallery} />
