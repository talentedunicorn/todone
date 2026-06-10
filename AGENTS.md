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

### 2. Version injection via Vite `define`

The app version is injected at build time via `vite.config.ts`:

```ts
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  ...
});
```

Access it anywhere via `src/lib/version.ts`:

```ts
export const APP_VERSION = __APP_VERSION__;
```

A `declare const __APP_VERSION__: string` type declaration lives in `src/vite-env.d.ts`.

**Used by:** `src/routes/About.svelte` — renders "Version — {APP_VERSION}" in the sidebar.

### 3. Pure utility functions in `src/lib/`

Stateless helpers with no reactive dependencies go in plain `.ts` files:

| File                     | Exports                             | Used by                       |
| ------------------------ | ----------------------------------- | ----------------------------- |
| `src/lib/format-time.ts` | `formatTime()`, `formatTimestamp()` | KanbanCard, ContentViewDialog |
| `src/lib/task.ts`        | `nextStatus()`                      | KanbanCard, KanbanColumn      |

### 4. Database adapter pattern

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

**Key query method — `getTodosPage`:** All list and kanban views use `getTodosPage()` which combines search (`$regex`), sort (`.sort()`), and pagination (`.skip()/.limit()`) at the RxDB level. The `TaskShell` component subscribes via `$effect` and provides page data + total count to children through snippets. The `pageSize` prop controls the page size (50 for list, 10000 for kanban).

**Auth token refresh in replication:** `setupReplication()` in `src/sync/replication.ts` accepts an `onTokenExpired` callback. When CouchDB returns a 401 (especially with a reason containing "exp" for JWT expiry), it calls `onTokenExpired` to silently refresh via Auth0's `getTokenSilently`. If refresh fails, auth state is cleared and the user is redirected to `/login`. The retry logic uses a `refreshing` guard to prevent concurrent refresh attempts and resets `retried` on failure so subsequent requests can retry.

```ts
// src/db.ts — passed as third arg to setupReplication
const onTokenExpired = async () => {
  const auth0 = getAuth0Client();
  if (!auth0) return null;
  try {
    const { id_token } = await auth0.getTokenSilently({ ... });
    token.set(id_token);
    return id_token;
  } catch {
    // Reauthentication failed — redirect to login
    isLoggedin.set(false);
    token.set(null);
    window.location.href = '/login';
    return null;
  }
};
```

### 5. Dialog shell pattern

Complex dialogs use a shared `<Dialog>` shell (`src/components/Dialog.svelte`) that manages `<dialog>` lifecycle, backdrop click, close button, and transitions. Consumers provide content via snippets:

```svelte
<Dialog open={isOpen} label="Title" onClose={handleClose}>
	<!-- content here -->
</Dialog>
```

### 6. Icon pattern

Icons follow a consistent pattern using a base `<Icon>` component with named wrappers (e.g., `IconX.svelte`, `IconH2.svelte`). Each wrapper is a thin Svelte component that passes SVG children to `<Icon>`.

### 7. Pagination pattern

`PaginationControls.svelte` is a standalone component for paginating list results. It auto-hides when all items fit on a single page.

**Props:** `page` (0-indexed), `totalCount`, `pageSize`, `onChange`

**Usage:** Placed in `TaskShell`'s `toolbar` snippet alongside `ViewToggle` and `SortControl`. Only rendered in list view (controlled by parent):

```svelte
<PaginationControls
	page={sortState.page}
	totalCount={sortState.totalCount}
	pageSize={sortState.pageSize}
	onChange={sortState.onPageChange}
/>
```

**Behavior:**

- Hidden when `totalCount <= pageSize` (single page)
- Hidden when `totalCount === 0` (empty)
- Previous disabled on first page, Next disabled on last page
- Shared `$effect` lifecycle with sort and search (changing page tears down and recreates the RxDB subscription)
