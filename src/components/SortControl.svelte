<script lang="ts">
	type SortField = 'updated' | 'created';
	type SortDir = 'asc' | 'desc';

	interface Props {
		field: SortField;
		dir: SortDir;
		onChange: (field: SortField, dir: SortDir) => void;
	}

	let { field, dir, onChange }: Props = $props();

	const options: { value: string; label: string; field: SortField; dir: SortDir }[] = [
		{ value: 'updated-desc', label: 'Updated (newest)', field: 'updated', dir: 'desc' },
		{ value: 'updated-asc', label: 'Updated (oldest)', field: 'updated', dir: 'asc' },
		{ value: 'created-desc', label: 'Created (newest)', field: 'created', dir: 'desc' },
		{ value: 'created-asc', label: 'Created (oldest)', field: 'created', dir: 'asc' }
	];

	function handleChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		const option = options.find((o) => o.value === value);
		if (option) {
			onChange(option.field, option.dir);
		}
	}
</script>

<label class="SortControl">
	<span class="visually-hidden">Sort by</span>
	<select value={`${field}-${dir}`} onchange={handleChange}>
		{#each options as opt}
			<option value={opt.value}>
				{opt.label}
			</option>
		{/each}
	</select>
</label>

<style>
	.SortControl {
		position: relative;
		display: flex;
		align-items: center;
	}

	select {
		font-family: var(--font);
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.35em 1.75em 0.35em 0.75em;
		border: 1px solid var(--gray);
		border-radius: 0.5em;
		background: transparent;
		color: var(--black);
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		transition: border-color 0.2s var(--ease);
		min-width: 0;
	}

	select:hover {
		border-color: var(--primary);
	}

	select:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.SortControl::after {
		content: '';
		position: absolute;
		right: 0.5em;
		top: 50%;
		translate: 0 -50%;
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-top: 5px solid var(--black);
		pointer-events: none;
	}
</style>
