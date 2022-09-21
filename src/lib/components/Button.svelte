<script>
	import './button.css';
	import { createEventDispatcher } from 'svelte';

	export let variant = 'primary';
	export let size = '';
	export let label = '';
	export let disabled = false;

	const dispatch = createEventDispatcher();

	/**
	 * Optional click handler
	 */
	function onClick(event) {
		dispatch('click', event.detail);
	}
</script>

<button
	type="button"
	class={['button', `${size}`, `${variant}`].join(' ')}
	{disabled}
	on:click={onClick}
>
	{label}
</button>
