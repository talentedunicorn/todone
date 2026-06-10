<script lang="ts">
	import Button from './Button.svelte';
	import themeStore from '../stores/theme';

	const ICON_SIZE = 24;
	const toggleTheme = () => {
		const html = document.querySelector('html');
		const themeData = html?.getAttribute('data-theme') ?? null;

		themeStore.toggleTheme(themeData);
		$themeStore.theme
			? html?.setAttribute('data-theme', $themeStore.theme)
			: html?.removeAttribute('data-theme');
	};
</script>

<!-- Icons from https://icon-sets.iconify.design/tabler/ -->
<Button size="small" class="ColorToggle" variant="link" onclick={toggleTheme}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={ICON_SIZE}
		height={ICON_SIZE}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		{#if $themeStore?.theme === 'dark'}
			<title>Dark</title>
			<path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z" />
		{:else if $themeStore?.theme === 'light'}
			<title>Light</title>
			<path
				d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"
			/>
		{:else}
			<title>System preference</title>
			<g>
				<path d="M9.173 14.83a4 4 0 1 1 5.657-5.657" />
				<path
					d="m11.294 12.707l.174.247a7.5 7.5 0 0 0 8.845 2.492A9 9 0 0 1 5.642 18.36M3 12h1m8-9v1M5.6 5.6l.7.7M3 21L21 3"
				/>
			</g>
		{/if}
	</svg>
</Button>
