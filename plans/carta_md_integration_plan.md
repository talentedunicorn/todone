# Plan: Integrate carta-md for WYSIWYG Markdown Editing

## Overview

Replace custom WYSIWYG toolbar implementation with carta-md library for better list handling, extensibility, and reduced maintenance.

## Why carta-md

- Lightweight, textarea-based editor (keeps markdown storage simple)
- Svelte 5 compatible
- Built-in toolbar (extensible)
- Keyboard shortcuts (extensible)
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

## Tech Debt from Current Implementation

- Keyboard shortcuts (recorded in WYSIWYG_MVP_plan.md)
- Custom list handling code (will be handled by carta-md)

## Next Steps

1. Install carta-md
2. Replace Form.svelte textarea with MarkdownEditor
3. Test all list types
4. Run full test suite
5. Update storybook tests
