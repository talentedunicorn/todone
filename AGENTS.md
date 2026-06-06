You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
MUST use this tool whenever writing Svelte code before sending it to the user.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link.

---

## Plan Management

Plans are stored in `~/.opencode_plans/todone/` (not in the repo). When working on features, review relevant plans to understand current state and next steps.

At the start of each session, check for stale plans — verify current state against the codebase and update accordingly.

---

## DRY Patterns & Shared Utilities

### 1. Reactive composables via `.svelte.ts`

Svelte 5 runes (`$state`, `$derived`, `$effect`) work in `.svelte.ts` files, enabling **shared reactive logic** without components. Example from the codebase:

**`src/lib/use-relative-time.svelte.ts`** — encapsulates a ticking 30s interval + reactive relative-time computation used by both `KanbanCard.svelte` and `ContentViewDialog.svelte`:

```ts
export function useRelativeTime(iso: () => string | undefined | null): {
	relativeTime: string;
} {
	let tick = $state(0);
	$effect(() => {
		const interval = setInterval(() => tick++, 30_000);
		return () => clearInterval(interval);
	});
	let relativeTime = $derived.by(() => {
		tick; // force dependency on ticker
		const val = iso();
		return val ? formatTime(val) : '';
	});
	return {
		get relativeTime() {
			return relativeTime;
		}
	};
}
```

Used in components:

```svelte
<script lang="ts">
	const time = useRelativeTime(() => task.updated);
</script>

<span>{time.relativeTime}</span>
```

**When to create a composable:** When the same reactive state logic (tickers, derived values, effects) appears in 2+ components, extract it to a `.svelte.ts` file.

### 2. Pure utility functions in `src/lib/`

Stateless helpers with no reactive dependencies go in plain `.ts` files:

| File                     | Exports                             | Used by                       |
| ------------------------ | ----------------------------------- | ----------------------------- |
| `src/lib/format-time.ts` | `formatTime()`, `formatTimestamp()` | KanbanCard, ContentViewDialog |
| `src/lib/task.ts`        | `nextStatus()`                      | KanbanCard, KanbanColumn      |

### 3. Database adapter pattern

The database layer follows a clean interface-driven pattern:

```
src/adapters/database.ts      — TaskDatabase interface (contract)
src/adapters/rxdb-adapter.ts  — RxDBTaskDatabase implementation
src/db.ts                     — Convenience exports + singleton init
```

When adding a new data operation:

1. Add method signature to `TaskDatabase` interface in `database.ts`
2. Implement it in `RxDBTaskDatabase` in `rxdb-adapter.ts`
3. Export a convenience wrapper in `db.ts`

### 4. Dialog shell pattern

Complex dialogs use a shared `<Dialog>` shell (`src/components/Dialog.svelte`) that manages `<dialog>` lifecycle, backdrop click, close button, and transitions. Consumers provide content via snippets:

```svelte
<Dialog open={isOpen} label="Title" onClose={handleClose}>
	<!-- content here -->
</Dialog>
```

### 5. Icon pattern

Icons follow a consistent pattern using a base `<Icon>` component with named wrappers (e.g., `IconX.svelte`, `IconH2.svelte`). Each wrapper is a thin Svelte component that passes SVG children to `<Icon>`.
