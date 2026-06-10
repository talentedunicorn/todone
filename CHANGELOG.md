# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2025-05-15

### Added

- Kanban board view with drag-and-drop column support
- Paginated list view with RxDB-level search, sort, and pagination
- Unified route (`/`) with view toggle between list and kanban
- Content viewer dialog for reading task content
- Task status badge component with cycle-to-next behavior
- `UpdatedAt` timestamp display on task cards and content viewer
- Reactive relative-time composable (`useRelativeTime`) with 30s ticker
- `restore()` method on TaskDatabase interface
- Shared StatusBadge component
- Keyboard shortcut registration utility with input-focus scoping
- Carta Markdown editor and viewer with code highlighting
- ToggleTheme component (light/dark/system)
- Export/Import JSON data controls
- About page with task statistics
- PWA support with offline service worker

### Changed

- Refactored FullScreenEditor to use shared Dialog shell
- Unified KanbanCard across list and kanban views
- Replaced inline status buttons with StatusBadge
- Migrated flat list items to use KanbanCard
- Improved table styles with cell borders, hover, and alternating rows
- Relocated database adapters to adapter pattern (TaskDatabase interface)
- Svelte 5 migration with runes ($state, $derived, $effect)

### Fixed

- Search not filtering due to Svelte 5 $effect dependency tracking
- Keyboard shortcuts typing into input fields
- Clipped editor on small screens
- SVG icon visibility in ToggleTheme
- Code and table overflow in MarkdownContent
- Break word on code tags

### Tests

- Added Storybook stories for Dialog, ContentViewDialog, IconX, FlatList, KanbanView
- Edge-case stories for KanbanCard, Toast, Button
- Database interface tests with in-memory adapter
- Vitest setup with Testing Library

### Chores

- Updated dependencies with Renovate bot
- Bumped pnpm version
- Package maintenance and orphaned file cleanup
