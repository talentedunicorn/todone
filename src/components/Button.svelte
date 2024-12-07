<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import './button.css';
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
