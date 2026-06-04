<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props extends HTMLButtonAttributes {
		variant?: 'link' | 'primary' | 'pill' | '';
		size?: string;
		type?: 'button' | 'submit' | 'reset';
		selected?: boolean;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
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
		`${rest.class ? (rest.class as string).split(' ') : ''}`
	]
		.filter((c) => c.trim().length > 0)
		.join(' ')}
	{onclick}
>
	{@render children?.()}
</button>

<style>
	button {
		--button-color: var(--black);
		--button-bg: var(--white);
		--border-color: var(--black);
		--border-radius: 0.7em;
		--border-width: 0.2em;

		font-family: inherit;
		font-weight: bold;
		font-size: 1rem;
		border: var(--border-width) solid var(--border-color);
		border-radius: var(--border-radius);
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

		&:hover:not(:disabled):not(.link):not(.pill) {
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

	.selected {
		--button-bg: var(--primary);
		--button-color: var(--white);
		--border-color: var(--primary);
	}

	.pill {
		--border-radius: 999px;
		padding: 0.5em 1em;
		border: none;
		white-space: nowrap;
		flex-shrink: 0;

		&:hover:not(:disabled) {
			opacity: 0.8;
			background-color: color-mix(in srgb, var(--primary) 40%, transparent);
		}
	}

	.link {
		--button-color: var(--primary);
		--border-color: transparent;
	}

	.link.selected:not(:disabled),
	.link:hover:not(:disabled) {
		--button-bg: color-mix(in srgb, var(--primary) 40%, transparent);
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
