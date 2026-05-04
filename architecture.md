# Architecture & Integration Plan

Consolidated from `architecture-deepening.md` + `carta_integration_roadmap.md` (storybook upgrade is complete).

---

## Part A: Architecture Deepening

Refactoring opportunities identified through codebase architecture analysis using principles from LANGUAGE.md (depth, seam, adapter, leverage, locality).

### Finding 1: Unused Database Adapter

**Files**: `src/adapters/database.ts` (interface), `src/db.ts` (implementation), `src/lib/rxdb.ts`

**Problem**: There's a defined interface (`TaskDatabase`) but it was never used — the real database code in `src/db.ts` directly imported RxDB. The interface was dead weight.

**Solution (grilled)**: Implement the adapter with the following design:

**Stream Interface** (library-agnostic):

```typescript
interface Stream<T> {
	subscribe(callback: (value: T) => void): () => void;
}
```

**TaskDatabase Interface** (data operations only):

```typescript
interface TaskDatabase {
	getTodos(): Stream<Todo[]>;
	add(data: { title: string; value: string }): Promise<Todo>;
	update(data: { id: string; title: string; value: string; completed: boolean }): Promise<unknown>;
	remove(id: string): Promise<unknown>;
	setCompleted(id: string, completed: boolean): Promise<unknown>;
	exportTodos(): Promise<Todo[]>;
	importTodos(data: Todo[]): Promise<unknown>;
	getDocCount(): Promise<{ complete: Stream<number>; incomplete: Stream<number> }>;
}
```

**Separate Factory** (init not in adapter):

```typescript
function createTaskDatabase(config: DbConfig): Promise<TaskDatabase>;
```

**Scope Decision**:

- Adapter handles: data operations only (CRUD, queries)
- Separate: DB initialization/collection creation (factory function)
- Separate: sync capability (already in `sync/replication.ts`, takes DB as param)

**Key Decision**: Use `Stream<T>` instead of RxJS Observable for DB-agnostic compatibility. RxDB observables wrapped to satisfy Stream; other stores can implement differently.

**Status**: Approved for implementation

---

**Finding 2 (linked)**: Shallow RxDB Wrapper — resolves to `src/lib/rxdb.ts` as internal implementation detail behind the adapter seam. Keep for now, may inline later.

---

### Finding 2: Shallow RxDB Wrapper

**Files**: `src/lib/rxdb.ts`

**Problem**: Only wraps `createRxDatabase` and adds a collection — a 1:1 pass-through with RxDB's own API. Interface nearly as complex as implementation. No leverage.

**Deletion test**: Delete it — all `import { createDatabase, createCollection } from './lib/rxdb'` calls in `src/db.ts` just become `import { createRxDatabase } from 'rxdb'`. No complexity concentrated, just moved.

**Solution**: Keep as internal implementation detail of the adapter. Wraps RxDB plugin config centrally. May inline later if adapter absorbs this logic.

**Status**: Deferred (linked to Finding 1)

---

### Finding 3: Mixed Carta Module

**Files**: `src/lib/carta.ts`

**Problem**: 153 lines mixing:

- Theme resolution (`resolveCodeTheme`)
- Viewer creation (`createViewerCarta`)
- Editor creation (`createEditorCarta`)
- Mutation observer for theme changes (`setupThemeAwareViewer`)

The interface takes `any[]` for plugins and sanitizer — typed as `any` not `Sanitizer`. This leaks into `Task.svelte` and `Form.svelte`.

**Solution**: Split into:

- **MarkdownViewer** module — creates viewers, handles theme switching
- **MarkdownEditor** module — creates editors with icon configurations
- Each has a focused interface with proper typing

**Status**: Pending

---

### Finding 4: Hardcoded Auth (No Seam)

**Files**: `src/auth.ts`, `src/stores/auth.ts`

**Problem**: Auth0 is hardcoded directly in `src/auth.ts`. There's a database adapter pattern (unused) but no auth adapter. If you wanted to swap Auth0 for another provider, you'd refactor everywhere.

**Solution**: Define an `AuthModule` interface (login, logout, getToken, getUser), implement it behind a seam. This mirrors the attempted database adapter architecture.

**Status**: Pending

---

### Finding 5: No Test Surface on Core Module

**Files**: `src/db.ts`

**Problem**: The core CRUD module is untested. All tests are component-level (Storybook). If the database adapter changes, there's no fast feedback loop.

**Deletion test**: Currently, deleting `src/db.ts` would scatter query logic across every component that uses it (List.svelte, Form.svelte, etc.). But there's no unit test to catch bugs when it changes.

**Solution**: After deepening the database adapter seam, add unit tests for the adapter.

**Status**: Pending

---

### Finding 6: Domain couples to RxDB (NEW)

**Files**: `src/domain/todo.ts`

**Problem**: The `Todo` type and `todoSchema` both import directly from `rxdb`. This leaks RxDB types into the domain layer. The domain technically knows about storage implementation (RxJsonSchema).

**Solution**: Extract pure TypeScript types for the domain, move schema to the adapter layer.

**Status**: Pending

---

### Finding 7: Replication couples to auth (NEW)

**Files**: `src/sync/replication.ts`

**Problem**: Directly imports `token` from `../stores/auth` to inject auth headers. This is cross-seam coupling — sync logic knows about auth state. Also directly imports `RxDatabase` type from rxdb.

**Solution**: Pass auth token through function parameters, not direct store import. Extract types from RxDB.

**Status**: Pending

---

## Part B: Carta Integration

Replace the custom WYSIWYG toolbar in `Form.svelte` with `carta-md`, keep markdown storage unchanged, and roll out future editor enhancements in phases.

### Why Carta

- Svelte 5 compatible markdown editor
- Built-in toolbar and keyboard shortcuts
- Better list handling and reduced custom editor logic
- Extensible plugin system for future enhancements
- Syntax highlighting support via Shiki

---

### Phase 1: MVP Integration ✅ Completed

Objective: replace custom toolbar code with `carta-md` core while maintaining feature parity.

Completed:

1. Installed `carta-md` and `isomorphic-dompurify`
2. Updated `Form.svelte` with browser-safe integration
3. Removed custom toolbar/list-manipulation helpers
4. Verified existing tests passed
5. Updated Storybook coverage for form editor behavior

Resolved technical debt:

- Keyboard shortcuts now use carta defaults (Cmd/Ctrl+B, I, H, `, K)
- List formatting edge cases handled by editor library

---

### Phase 1.5: Table & Image Toolbar Extensions ✅ Completed

Objective: Add table and image toolbar buttons to the carta-md editor.

Completed:

- **Table**: Insert 3x3 markdown table template at cursor
- **Image**: Insert image markdown syntax `![Alt text](url)` at cursor
- Uses standard markdown rendering for images (SimpleImage removed)

Implementation details:

- IconTable.svelte and IconImage.svelte components created
- Custom icons integrated into carta extensions in Form.svelte

---

### Phase 2: Rendering Consistency ✅ Completed

- Task.svelte now uses carta-md with `@cartamd/plugin-code` for syntax highlighting
- Shiki configured with `github-light` and `github-dark` themes
- Dynamic light/dark theme switching via MutationObserver on `data-theme` attribute
- Keep `marked` in About.svelte (no immediate need to migrate)

---

### Phase 3: Plugin Integration

Candidates:

- `@cartamd/plugin-anchor` (heading anchor links, medium priority)
- `@cartamd/plugin-code` (enhanced code highlighting, low priority)
- `@cartamd/plugin-emoji` (emoji picker, low priority)
- `@cartamd/plugin-slash` (slash commands, low priority)

---

### Phase 4: Theme Customization

- Start with carta defaults, then map styles to app variables
- Keep custom CSS minimal to reduce maintenance

---

### Phase 5: Advanced Features

- Image upload/embedding
- Custom component rendering (task-specific)
- Split editor/preview mode

---

### Architectural Deepening: Duplicate `buildCarta()` Logic

**Files:** `src/components/Form.svelte`, `src/components/Task.svelte`, `src/routes/About.svelte`

**Problem:** Each component independently defines its own `buildCarta()` function with overlapping but diverging configuration. This creates:

- Code duplication across 3 files
- Inconsistent sanitizer settings (Form uses DOMPurify, others disable)
- No shared theme system (only Task.svelte handles themes)

**Solution:** Extract a shared `carta` module (`src/lib/carta.ts`) with:

- `createEditorCarta(options?)` - for MarkdownEditor (Form), accepts `{ enableCodeHighlighting?: boolean, customIcons?: Icon[], plugins?: Extension[] }`
- `createViewerCarta(options?)` - for Markdown display (Task, About), accepts `{ theme?: string, plugins?: Extension[] }`
- `setupThemeAwareViewer()` - returns `{ carta, destroy }` with MutationObserver for theme switching
- Centralized sanitizer policy (DOMPurify enabled by default)
- Theme-aware builder with shared logic

**Status**: Implemented in part (2026-05-05) - Direct MutationObserver in Task.svelte for reactive code block theming

---

## Prioritization

1. **Finding 1: Database Adapter** — Next to implement (design finalized)
2. **Finding 2: Shallow RxDB Wrapper** — Deferred to Finding 1
3. **Finding 3: Mixed Carta Module** — Pending
4. **Finding 4: Hardcoded Auth** — Pending
5. **Finding 5: No Test Surface** — After Finding 1
6. **Finding 6: Domain couples to RxDB** — After Finding 1
7. **Finding 7: Replication couples to auth** — After Finding 1

---

## Grilling Notes

### Finding 1: Database Adapter (grilled 2026-05-04)

**Q**: Which path would allow easier RxDB replacement?
**A**: None directly — adapter is the seam. rxdb.ts is internal impl detail.

**Q**: Keep Observable semantics or change?
**A**: Use generic `Stream<T>` interface for DB-agnostic compatibility.

**Q**: Scope of adapter?
**A**: Data operations only. Init and sync are separate concerns.

**Decisions captured**:

- Stream interface: `subscribe(callback) => unsubscribe`
- Separate factory for initialization
- Sync remains in `sync/replication.ts` (takes adapter)

---

_Generated: 2026-05-04_
_Consolidated: 2026-05-04_
