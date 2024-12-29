<script lang="ts">
	import Button from './Button.svelte';

	let theme = $state<string | null>(null);

	const ICON_SIZE = 24;
	const toggleTheme = () => {
		const html = document.querySelector('html');
		const themeData = html?.getAttribute('data-theme');
		let nextTheme;
		switch (themeData) {
			case 'dark':
				nextTheme = 'light';
				break;
			case 'light':
				nextTheme = null;
				break;
			default:
				nextTheme = 'dark';
				break;
		}
		theme = nextTheme;
		nextTheme ? html?.setAttribute('data-theme', nextTheme) : html?.removeAttribute('data-theme');
	};
</script>

<!-- Icons from https://icon-sets.iconify.design/tabler/ -->
<Button size="small" class="ColorToggle" variant="link" onclick={toggleTheme}>
	{#if theme === 'dark'}
		<svg
			width={ICON_SIZE}
			height={ICON_SIZE}
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Dark</title>
			<path
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"
			/>
		</svg>
	{:else if theme === 'light'}
		<svg
			width={ICON_SIZE}
			height={ICON_SIZE}
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Light</title><path
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"
			/>
		</svg>
	{:else}
		<svg
			width={ICON_SIZE}
			height={ICON_SIZE}
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>System preference</title><g
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				><path d="M9.173 14.83a4 4 0 1 1 5.657-5.657" /><path
					d="m11.294 12.707l.174.247a7.5 7.5 0 0 0 8.845 2.492A9 9 0 0 1 5.642 18.36M3 12h1m8-9v1M5.6 5.6l.7.7M3 21L21 3"
				/></g
			>
		</svg>
	{/if}
</Button>
