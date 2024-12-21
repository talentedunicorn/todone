<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props extends HTMLButtonAttributes {
		variant?: 'link' | 'primary' | '';
		size?: string;
		type?: 'button' | 'submit' | 'reset';
		selected?: boolean;
		children?: Snippet;
		onclick?: () => void;
		[key: string]: any;
	}

	let {
		variant = '',
		size = '',
		type = 'button',
		selected = false,
		children,
		onclick,
		...rest
	}: Props = $props();
</script>

<button
	{...rest}
	{type}
	class={[
		'button',
		`${size}`,
		`${variant}`,
		`${selected ? 'selected' : ''}`,
		`${rest.class ? rest.class.split(' ') : ''}`
	]
		.filter((c) => c.trim().length > 0)
		.join(' ')}
	{onclick}
>
	{#if children}{@render children()}{:else}Button text{/if}
</button>

<style>
	button {
		--button-color: var(--black);
		--button-bg: var(--white);
		--border-color: var(--black);

		font-family: inherit;
		font-weight: bold;
		font-size: 1rem;
		border: 0.2em solid var(--border-color);
		border-radius: 0.7em;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		line-height: 1;
		background-color: var(--button-bg);
		color: var(--button-color);
		padding: 0.5em;
		white-space: nowrap;

		&:hover:not(:disabled):not(.link) {
			background-color: var(--button-color);
			color: var(--button-bg);
		}

		&:disabled {
			--button-color: var(--gray);
			--border-color: var(--gray);
			--button-bg: var(--gray-light);
			pointer-events: none;
		}
	}

	.primary {
		--button-color: var(--primary);
		--border-color: var(--primary);
	}

	.link {
		--button-color: var(--primary);
		--border-color: var(--white);
	}

	.link.selected:not(:disabled),
	.link:hover:not(:disabled) {
		--button-bg: transparent;
		--border-color: var(--button-bg);
		--button-color: var(--black);
	}

	.small {
		padding: 0.2em 0.5em;
		border-radius: 0.5em;
	}

	.large {
		font-size: 1.2rem;
	}

	@media (prefers-reduced-motion: no-preference) {
		.button {
			transition: all 0.3s var(--ease);
		}
	}
</style>
