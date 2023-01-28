<script>
	import { createEventDispatcher } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher();

	export let title = '';
	export let value = '';
	export let completed = false;
	/** @type {Date|undefined}*/
	export let updated;
	$: completeText = completed ? 'Mark Incomplete' : 'Mark Completed';
	$: formattedTimestamp =
		updated &&
		`Updated ― ${Intl.DateTimeFormat('en-MY', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(updated))}`;
</script>

<section>
	<header data-updated={formattedTimestamp}>
		<h3>{title}</h3>
	</header>
	<div class="Content">
		<SvelteMarkdown source={value} />
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
		flex-wrap: wrap;
		justify-content: space-between;
		font-size: 1.5rem;
		gap: 1rem;
	}

	header::after {
		content: attr(data-updated);
		color: var(--gray);
		font-size: 0.8rem;
		font-weight: bold;
	}

	h3 {
		margin: 0;
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

	.Content {
		word-break: break-word;
	}

	@media screen and (min-width: 50rem) {
		header {
			justify-content: space-between;
		}
	}
</style>
