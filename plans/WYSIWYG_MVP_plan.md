# WYSIWYG MVP Plan: Form Body Toolbar

## Status: Superseded by carta-md Integration

This plan documented the original custom toolbar approach. The implementation was replaced by carta-md (see carta_integration_roadmap.md).

**Historical note**: The custom toolbar was implemented in Form.svelte but has been superseded.

## Scope (MVP) - COMPLETED

- Toolbar above the content textarea
- Actions: Bold, Italic, Heading, Inline Code, Code Block, Bulleted List, Numbered List, Checklist, Link
- Auto-insert on Enter for list items (like GitHub comment form)
- Nested list handling with proper indentation
- Press Enter on empty list item creates new paragraph
- Data persistence remains as markdown text in the existing Todo value field.

## UI/UX - COMPLETED

- Toolbar positioned above the content area, always visible (non-floating)
- Buttons use text labels: Bold, Italic, Heading, Inline Code, Code Block, Bulleted List, Numbered List, Checklist, Link
- Toolbar stretches across full form width

## Tech Debt (Keyboard Shortcuts)

- Record keyboard shortcuts for WYSIWYG actions as tech debt
- Priority: Medium
- Acceptance criteria:
  - Document planned shortcuts: Bold, Italic, Heading, Inline Code, Code Block
  - Default mappings: Cmd/Ctrl+B, I, H, `, K
  - No MVP implementation; schedule for a future sprint
  - Include test plan notes and docs updates

## Testing Plan (MVP) - COMPLETED

- QA: toolbar renders above content, labels are correct
- Verify: inserting tokens around selection and placeholders when nothing selected
- Confirm markdown stored in Todo.value is valid markdown
- Visual regression: existing markdown highlight/preview unaffected
- All 23 tests passing

## Future Work: carta-md Integration

See `plans/carta_integration_roadmap.md` for details.

Rationale for future:

- Current custom implementation has edge cases with list handling
- carta-md provides better out-of-box list behavior, extensibility, and maintenance
- Would reduce custom code and leverage well-tested library

Implementation approach:

1. Install carta-md
2. Replace custom toolbar + textarea with carta-md editor
3. Verify all list types work correctly
4. Run full test suite
5. Update storybook tests

## Out of Scope

- Keyboard shortcuts (deferred to tech debt)
- Image upload handling
- Theme customization beyond default

## Next Steps

- Merge PR #571
- Schedule carta-md integration for future sprint
- Address keyboard shortcuts tech debt in future
- Use single space for Tab in content area (MVP); no multi-line indentation yet.
- Update tests and docs to reflect the simple Tab behavior.
