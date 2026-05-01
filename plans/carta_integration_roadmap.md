# Carta Integration Roadmap

## Executive Summary

Replace custom WYSIWYG toolbar in `Form.svelte` with carta-md editor, then progressively enhance with plugins and features through phased releases.

---

## Phase 1: MVP Integration ✅ COMPLETED

### Objective

Replace custom toolbar code with carta-md core, maintain feature parity, reduce ~150 lines of custom code.

### Completed Steps

1. Installed `carta-md` + `isomorphic-dompurify`
2. Updated `Form.svelte` with dynamic browser-side import
3. Removed custom toolbar functions
4. Verified tests pass (14/14)

### Tech Debt Resolved

- Keyboard shortcuts now included (carta default: Cmd/Ctrl+B, I, H, `, K)
- List handling edge cases handled by library

---

## Phase 2: Rendering Consistency (Optional) - NOT STARTED

### Objective

Use carta for markdown rendering in `Task.svelte` for consistency with editor.

### Decision Point

**Keep `marked` or switch to carta?**

| Aspect       | Keep `marked`      | Switch to carta                          |
| ------------ | ------------------ | ---------------------------------------- |
| Code changes | None               | Replace `marked()` with `carta.render()` |
| Consistency  | Different libs     | Same lib for edit/render                 |
| Highlight.js | Already integrated | Replaced by Shiki                        |
| Bundle size  | Current            | May increase                             |

**Recommendation**: Keep `marked` for now, revisit after Phase 1 proven stable.

---

## Phase 3: Plugin Integration - NOT STARTED

### Plugins to Consider

| Plugin                   | Install    | Use Case                 | Priority |
| ------------------------ | ---------- | ------------------------ | -------- |
| `@cartamd/plugin-anchor` | `pnpm add` | Heading anchor links     | MEDIUM   |
| `@cartamd/plugin-code`   | `pnpm add` | Better code highlighting | LOW      |
| `@cartamd/plugin-emoji`  | `pnpm add` | Emoji picker             | LOW      |
| `@cartamd/plugin-slash`  | `pnpm add` | Slash commands           | LOW      |

**Decision**: Defer all plugins until Phase 1 proven stable.

---

## Phase 4: Theme Customization - NOT STARTED

### Options

1. Use default carta theme (simplest)
2. Override CSS variables to match app (`--black`, `--white`, etc.)
3. Custom toolbar icons

**Decision**: Use default for now, revisit after user feedback.

---

## Phase 5: Advanced Features - FUTURE

- Image upload/embedding
- Custom component rendering (task-specific)
- Split editor/preview mode

---

## Risk Considerations

1. **Breaking changes**: Carta v4 is active (latest: Jun 2025). Monitor for breaking changes in minor releases.
2. **Bundle size**: carta adds Shiki (~500KB). Consider tree-shaking if needed.
3. **SSR**: App appears SPA (`vite-plugin-pwa`), but carta supports SSR if needed later.

---

## File Changes Summary

| File                                        | Change                                 |
| ------------------------------------------- | -------------------------------------- |
| `package.json`                              | Add `carta-md`, `isomorphic-dompurify` |
| `src/components/Form.svelte`                | Replace toolbar/textarea with carta    |
| `src/components/Form.stories.svelte`        | Update stories                         |
| `src/components/WysiwygPlan.stories.svelte` | Deleted (old toolbar tests)            |
| `plans/carta_md_integration_plan.md`        | Mark MVP complete                      |
