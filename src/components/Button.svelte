<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import './button.css';

	interface $$Props extends Partial<HTMLButtonAttributes> {
		variant?: 'link' | 'primary';
		size?: string;
		type?: 'button' | 'submit' | 'reset';
		selected?: boolean;
	}

	export let variant = '';
	export let size = '';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let selected = false;
</script>

<button
	{...$$restProps}
	{type}
	class={[
		'button',
		`${size}`,
		`${variant}`,
		`${selected ? 'selected' : ''}`,
		`${$$restProps.class ? $$restProps.class.split(' ') : ''}`
	]
		.filter((c) => c.trim().length > 0)
		.join(' ')}
	on:click
>
	<slot>Button text</slot>
</button>
