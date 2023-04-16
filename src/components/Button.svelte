<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import './button.css';

	export let variant = '';
	export let size = '';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled = false;
	export let selected = false;

	const dispatch = createEventDispatcher();

	function onClick(event: { detail: any }) {
		dispatch('click', event.detail);
	}
</script>

<button
	{type}
	class={['button', `${size}`, `${variant}`, `${selected ? 'selected' : ''}`]
		.filter((c) => c.trim().length > 0)
		.join(' ')}
	{disabled}
	on:click={onClick}
>
	<slot>Button text</slot>
</button>
