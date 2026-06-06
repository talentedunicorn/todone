<script lang="ts">
	import { push } from 'svelte-spa-router';
	import { onMount } from 'svelte';

	onMount(() => {
		push('/');
	});
</script>
