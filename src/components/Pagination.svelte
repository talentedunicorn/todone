<script lang="ts">
	let { currentPage, totalPages, limit, onPageChange, onLimitChange } = $props();
</script>

<div class="Pagination">
	<div>
		<select
			value={`${limit}`}
			onchange={(e) => onLimitChange(Number((e.currentTarget as HTMLSelectElement).value))}
		>
			<option value="5">5</option>
			<option value="10">10</option>
			<option value="20">20</option>
			<option value="50">50</option>
			<option value="100">100</option>
		</select>
		<span>per page</span>
	</div>
	<p class="Pagination-controls">
		<select
			bind:value={currentPage}
			onchange={(e) => onPageChange(Number((e.currentTarget as HTMLSelectElement).value))}
		>
			{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
				<option value={page}>{page}</option>
			{/each}
		</select>
		of <span class="Title">{totalPages}</span>
	</p>
</div>

<style>
	.Pagination {
		display: flex;
		align-items: end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 2rem;
		margin-top: 2rem;

		& > * {
			display: inline-flex;
			flex-flow: row;
			align-items: inherit;
			gap: 1rem;
		}

		.Pagination-controls {
			margin-left: auto;
			font-weight: bold;
			margin: 0;

			.Title {
				line-height: 1;
			}
		}
	}
</style>
