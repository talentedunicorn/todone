<script lang="ts">
	import Icon from './Icon.svelte';

	let { ...rest }: Record<string, unknown> = $props();
</script>

<Icon size={24} {...rest}>
	<line x1="18" y1="6" x2="6" y2="18" />
	<line x1="6" y1="6" x2="18" y2="18" />
</Icon>
