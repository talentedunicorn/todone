<script lang="ts">
	let { node } = $props<{ node: { url: string; alt: string } }>();
</script>

<div class="custom-image-wrapper">
	<img src={node.url} alt={node.alt} />
	<span class="caption">{node.alt}</span>
</div>

<style>
	.custom-image-wrapper {
		display: block;
		margin: 1rem 0;
		text-align: center;
	}
	img {
		max-width: 100%;
		border-radius: 0.5rem;
		border: 0.2em solid var(--gray-light);
	}
	.caption {
		display: block;
		font-size: 0.8rem;
		color: var(--gray);
		margin-top: 0.5rem;
	}
</style>
