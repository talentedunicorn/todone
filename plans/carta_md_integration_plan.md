# Plan: Integrate carta-md for WYSIWYG Markdown Editing

## Overview

Replace custom WYSIWYG toolbar implementation with carta-md library for better list handling, extensibility, and reduced maintenance.

## Why carta-md

- Lightweight, textarea-based editor (keeps markdown storage simple)
- Svelte 5 compatible
- Built-in toolbar (extensible)
- Keyboard shortcuts (extensible) - **NOW RESOLVED**
- Syntax highlighting via Shiki
- Supports 150+ remark plugins
- SSR compatible

## Scope

- Replace Form.svelte WYSIWYG toolbar with carta-md
- Keep existing markdown storage in Todo.value
- Preserve existing Task.svelte markdown rendering
- Test list handling (bulleted, numbered, nested, checklist)
- Verify keyboard shortcuts work

## Out of Scope

- Theme customization (use default for now)
- Image upload handling
- Slash commands plugin

## Implementation Notes

- Install: `pnpm add carta-md`
- Import: `import { Carta, MarkdownEditor } from 'carta-md'`
- CSS: `import 'carta-md/default.css'`
- Config: `const carta = new Carta({ sanitizer: ... })`
- Sanitizer required: isomorphic-dompurify

## Tech Debt from Current Implementation - RESOLVED

- Keyboard shortcuts - **NOW BUILT-IN** via carta-md
- Custom list handling code - **NOW HANDLED** by carta-md

## Status: ✅ COMPLETE (Phase 1)

- [x] Install carta-md + isomorphic-dompurify
- [x] Replace Form.svelte textarea with MarkdownEditor
- [x] Test all list types
- [x] Run full test suite
- [x] Update storybook tests

## Next Steps

1. ~~Install carta-md~~ ✅ DONE
2. ~~Replace Form.svelte textarea with MarkdownEditor~~ ✅ DONE
3. ~~Test all list types~~ ✅ DONE
4. ~~Run full test suite~~ ✅ DONE
5. ~~Update storybook tests~~ ✅ DONE
6. Create roadmap for future phases

---

## Post-MVP Roadmap

See `plans/carta_integration_roadmap.md` for detailed future phases.

### Phase 2: Rendering Consistency (Optional)

- Keep `marked` or switch to carta's `Markdown` component

### Phase 3: Plugin Integration

- `plugin-anchor` - heading anchor links (medium priority)
- `plugin-emoji` - emoji picker (low priority)
- `plugin-slash` - slash commands (low priority)

### Phase 4: Theme Customization

- Override CSS to match app variables

### Phase 5: Advanced Features

- Image upload/embedding
- Custom component rendering
- Split editor/preview mode
