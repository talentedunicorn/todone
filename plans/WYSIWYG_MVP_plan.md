# WYSIWYG MVP Plan: Form Body Toolbar

Overview

- Add a minimal, toolbar-based WYSIWYG for the form body (content textarea) using markdown syntax.
- MVP uses text labels on buttons (Plan B) and does not implement keyboard shortcuts in MVP (tech debt).

Scope (MVP)

- Toolbar above the content textarea
- Actions: Bold, Italic, Heading, Inline Code, Code Block, Bulleted List, Numbered List, Checklist, Link
- Behavior: If text is selected, wrap/insert markdown tokens around the selection; if no selection, insert a sensible placeholder and place caret for typing.
- Data persistence remains as markdown text in the existing Todo value field.

UI/UX

- Toolbar positioned above the content area, always visible (non-floating)
- Buttons use text labels: Bold, Italic, Heading, Inline Code, Code Block, Bulleted List, Numbered List, Checklist, Link
- Styling to be minimal, alignment with existing app theme

Tech Debt (Keyboard Shortcuts)

- Record keyboard shortcuts for WYSIWYG actions as tech debt
- Priority: Medium
- Acceptance criteria:
  - Document planned shortcuts: Bold, Italic, Heading, Inline Code, Code Block
  - Default mappings: Cmd/Ctrl+B, I, H, `, K
  - No MVP implementation; schedule for a future sprint
  - Include test plan notes and docs updates

Testing Plan (MVP)

- QA: toolbar renders above content, labels are correct
- Verify: inserting tokens around selection and placeholders when nothing selected
- Confirm markdown stored in Todo.value is valid markdown
- Visual regression: existing markdown highlight/preview unaffected

Next Steps

- Create a plan task for UI integration in Form.svelte (no code changes in MVP mode)
- Document out-of-scope items and dependencies
- Schedule implementation and tests in a future sprint
