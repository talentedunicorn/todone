<script lang="ts">
	import { throttle } from '../lib/helpers';
	import Button from './Button.svelte';

	interface Props {
		query: string;
	}
	let searchInput: HTMLInputElement;
	let showSearch = $state(false);

	let { query = $bindable() }: Props = $props();
</script>

<form class="Search" onsubmit={(e) => e.preventDefault()}>
	<label for="search" class="visually-hidden">Search by title</label>
	<input
		type="search"
		name="query"
		id="search"
		class:visually-hidden={!showSearch}
		bind:value={query}
		bind:this={searchInput}
		placeholder="Type to search"
		data-testid="input"
	/>
	{#if showSearch}
		<Button
			onclick={() => {
				showSearch = false;
				query = '';
			}}
			size="small"
			variant="link"
			data-testid="hideSearch"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="Hide search"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m9 6l6 6l-6 6"
				/>
			</svg>
		</Button>
	{:else}
		<Button
			onclick={() => {
				showSearch = true;
				searchInput.focus();
			}}
			size="small"
			variant="link"
			data-testid="showSearch"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="Show search"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M11.36 20.213L9 21v-8.5L4.52 7.572A2 2 0 0 1 4 6.227V4h16v2.172a2 2 0 0 1-.586 1.414L15 12m0 6a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.2 2.2L22 22"
				/>
			</svg>
		</Button>
	{/if}
</form>

<style>
	.Search {
		align-self: flex-end;
		display: inline-flex;
		gap: 1rem;
		padding: 0.5rem;
		background: var(--white);
		border-radius: 0.5rem;
		border: var(--gray-light) 1px solid;

		input {
			flex: 1;
		}
	}
</style>
