# Carta Integration Plan (Consolidated)

## Overview

Replace the custom WYSIWYG toolbar in `Form.svelte` with `carta-md`, keep markdown storage unchanged, and roll out future editor enhancements in phases.

## Why Carta

- Svelte 5 compatible markdown editor
- Built-in toolbar and keyboard shortcuts
- Better list handling and reduced custom editor logic
- Extensible plugin system for future enhancements
- Syntax highlighting support via Shiki

---

## Current Status

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

## Next Steps

1. Add syntax highlighting support for dynamic light/dark theme switching
2. Test with Storybook to verify UI changes after theming and editor updates
3. Decide whether to keep `marked` in `Task.svelte` or switch rendering to carta for consistency

---

## Post-MVP Roadmap

### Phase 2: Rendering Consistency (Optional)

Use carta for markdown rendering in `Task.svelte` only if consistency benefits outweigh migration cost.

Recommendation: keep `marked` for now and revisit after theme updates stabilize.

### Phase 3: Plugin Integration

Candidates:

- `@cartamd/plugin-anchor` (heading anchor links, medium priority)
- `@cartamd/plugin-code` (enhanced code highlighting, low priority)
- `@cartamd/plugin-emoji` (emoji picker, low priority)
- `@cartamd/plugin-slash` (slash commands, low priority)

### Phase 4: Theme Customization

- Start with carta defaults, then map styles to app variables
- Keep custom CSS minimal to reduce maintenance

### Phase 5: Advanced Features

- Image upload/embedding
- Custom component rendering (task-specific)
- Split editor/preview mode

---

## Risk Considerations

1. Carta v4 is actively evolving; monitor release notes for breaking changes.
2. Shiki can increase bundle size; optimize only if performance metrics require it.
3. Current app is SPA-oriented, but future SSR usage may require hydration checks.

---

## Files Updated During MVP

- `package.json`
- `pnpm-lock.yaml`
- `src/components/Form.svelte`
- `src/components/Form.stories.svelte`
- `vitest.config.ts`
