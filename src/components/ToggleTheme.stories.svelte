<script module lang="ts">
	import ToggleTheme from './ToggleTheme.svelte';
	import Icon from './Icon.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'ToggleTheme'
	});
</script>

<Story name="Interactive">
	<div
		style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid var(--gray-light); border-radius: 0.5rem; width: fit-content;"
	>
		<ToggleTheme />
		<span style="font-size: 0.85rem; color: var(--gray);"
			>Click to cycle: system preference → dark → light</span
		>
	</div>
</Story>

<Story name="All theme states">
	<div style="display: flex; gap: 2rem; padding: 1rem; flex-wrap: wrap;">
		<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
			<Icon fill="currentColor" size={32} style="color: var(--primary)">
				<title>System preference</title>
				<g
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
				>
					<path d="M9.173 14.83a4 4 0 1 1 5.657-5.657" />
					<path
						d="m11.294 12.707l.174.247a7.5 7.5 0 0 0 8.845 2.492A9 9 0 0 1 5.642 18.36M3 12h1m8-9v1M5.6 5.6l.7.7M3 21L21 3"
					/>
				</g>
			</Icon>
			<span style="font-size: 0.8rem; color: var(--gray);">System preference</span>
		</div>
		<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
			<Icon fill="currentColor" size={32} style="color: var(--primary)">
				<title>Dark</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"
				/>
			</Icon>
			<span style="font-size: 0.8rem; color: var(--gray);">Dark</span>
		</div>
		<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
			<Icon fill="currentColor" size={32} style="color: var(--primary)">
				<title>Light</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"
				/>
			</Icon>
			<span style="font-size: 0.8rem; color: var(--gray);">Light</span>
		</div>
	</div>
</Story>
