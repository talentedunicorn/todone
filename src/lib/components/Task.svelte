<script>
  import SvelteMarkdown from 'svelte-markdown';
  import Button from "./Button.svelte";
  export let title = ''
  export let body = ''
  export /**
	 * @type {Date?}
	 */
  let updated = null

  function formatTimestamp(value){
    if (!value) return ''
    return Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(value);
  };
</script>

<section>
  <h3 data-updated={formatTimestamp(updated)}>{title}</h3>
  <div>
    <SvelteMarkdown source={body} />
  </div>
  <div class="actions">
    <Button>Delete</Button>
    <Button>Edit</Button>
    <Button variant="primary">Mark complete</Button>
  </div>
</section>

<style>
  section,
  h3 {
    display: flex;
    flex-flow: column;
  }

  section {
    padding: 1rem;
    border: 1px solid var(--gray-light);
    border-radius: 0.5em;
    gap: 1rem;
  }
  
  h3 {
    font-size: 2rem;
    margin: 0;
  }

  h3::before {
    content: attr(data-updated);
    font-size: 0.9rem;
    font-weight: normal;
    color: var(--gray);
    align-self: end;
  }

  .actions {
    display: flex;
    justify-content: end;
    gap: 1rem;
  }
</style>