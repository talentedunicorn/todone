<script>
	import { createEventDispatcher } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher();

	export let title = '';
	export let body = '';
	export let completed = false;
	export /**
	 * @type {number}
	 */
	let updated;

	$: completeText = completed ? 'Mark Incomplete' : 'Mark Completed';
	function formatTimestamp(/** @type {number} */ value) {
		if (!value) return '';
		// Check for values without milliseconds 
		if (value.toString().length < 13) {
			value = value * 1000
		}
		return Intl.DateTimeFormat('en-US', {
			dateStyle: 'medium',
			timeStyle: 'medium'
		}).format(new Date(value));
	}
</script>

<section>
	<header data-updated={formatTimestamp(updated)}>
		<h3>{title}</h3>
	</header>
	<div class="Content">
		<SvelteMarkdown source={body} />
	</div>
	<div class="Actions">
		<Button size="small" on:click={() => dispatch('delete')}>Delete</Button>
		<Button size="small" on:click={() => dispatch('edit')}>Edit</Button>
		<Button size="small" variant="primary" on:click={() => dispatch('complete')}
			>{completeText}</Button
		>
	</div>
</section>

<style>
	section,
	header {
		display: flex;
	}

	section {
		flex-wrap: wrap;
		padding: 1rem;
		border: 1px solid var(--gray-light);
		border-radius: 0.5em;
		gap: 1rem;
		background: var(--white);
	}

	header {
		flex-flow: column;
		font-size: 1.5rem;
		gap: 1rem;
	}

	h3 {
		margin: 0;
	}

	header::before {
		content: attr(data-updated);
		font-size: 0.9rem;
		font-weight: normal;
		color: var(--gray);
	}

	header,
	.Actions,
	.Content {
		flex: 100%;
	}

	.Actions {
		display: flex;
		justify-content: end;
		gap: 1rem;
	}

	@media screen and (min-width: 50rem) {
		header {
			justify-content: space-between;
		}
	}
</style>
