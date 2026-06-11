# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 2.0.3 (2026-06-11)


### Bug Fixes

* removed sentry feedback form due to overlap with FAB ([#618](https://github.com/talentedunicorn/todone/issues/618)) ([d6afe91](https://github.com/talentedunicorn/todone/commit/d6afe9104f1c8d0c7c7d4240a6b44f4ffd8924f9))
* removed unnecessary carta init in form ([77a9bed](https://github.com/talentedunicorn/todone/commit/77a9bed22303042e4210f3aa377274f8c6c7e078))
* update dependencies and resolve security vulnerabilities ([#576](https://github.com/talentedunicorn/todone/issues/576)) ([e02c6bc](https://github.com/talentedunicorn/todone/commit/e02c6bc8dcc8498d63841dd80ff0e5496405773a))

## 2.0.2 (2026-06-10)


### Bug Fixes

* removed sentry feedback form due to overlap with FAB ([5a9ffde](https://github.com/talentedunicorn/todone/commit/5a9ffdea66ffa0eaeea7c1d4d706342b6d3ca97f))
* update dependencies and resolve security vulnerabilities ([#576](https://github.com/talentedunicorn/todone/issues/576)) ([e02c6bc](https://github.com/talentedunicorn/todone/commit/e02c6bc8dcc8498d63841dd80ff0e5496405773a))

## [2.0.1](https://github.com/talentedunicorn/todone/compare/v2.0.0...v2.0.1) (2026-06-10)

### Bug Fixes

- handle expired token from server and reauthenticate ([25a6508](https://github.com/talentedunicorn/todone/commit/25a65080969337c65f6d65e29d64d7409a2e0d89))

## 2.0.0 (2026-06-10)

### Features

- add 'Clear done' button above Done column ([0444c29](https://github.com/talentedunicorn/todone/commit/0444c299804ab60fa70f61732a91230893b589bd))
- add floating action button (FAB) for quick new task creation ([737e81b](https://github.com/talentedunicorn/todone/commit/737e81bfe7aa051ac16ec4fb99375b83bcc50f98))
- add format-time utility and useRelativeTime Svelte 5 composable ([ccabae1](https://github.com/talentedunicorn/todone/commit/ccabae1d2cda32a13f18e9d3cb65e82c50300ce8))
- add global keyboard shortcuts ([473ae0c](https://github.com/talentedunicorn/todone/commit/473ae0cdd1403d50963febe3401a359471f17e70))
- add KanbanView and FlatList stories ([2bafa08](https://github.com/talentedunicorn/todone/commit/2bafa08604d07f4e4f06833664bbbaf9acab6d73))
- add pagination UI with list view support (Phase 2) ([9f2ace5](https://github.com/talentedunicorn/todone/commit/9f2ace58ce9278941850d964d9ba1e68e72edf37))
- add pill variant to Button component ([8376907](https://github.com/talentedunicorn/todone/commit/837690742c360f03002e432582c2958e3f01e9b5))
- add restore() to TaskDatabase and fix setStatus to update timestamp ([f7bbb38](https://github.com/talentedunicorn/todone/commit/f7bbb38edb4903f6e14f6b1583e61e770670f6fd))
- add scaffolding (nextStatus, IconX, Dialog, ContentViewDialog) ([21566e5](https://github.com/talentedunicorn/todone/commit/21566e59c6a4e19efd203571ae350bf5a91af8ca))
- add shared StatusBadge component with cycle-to-next behavior ([9f5d6ee](https://github.com/talentedunicorn/todone/commit/9f5d6ee8d48aa0d6b2dbd0b3d5a6f4f93b5aed2b))
- add task status and delete controls to edit form, refactor SVG icons ([01dd95a](https://github.com/talentedunicorn/todone/commit/01dd95a106434f43a6bbd95b079b83d201c8a754))
- add undo on task delete via toast ([de46ab5](https://github.com/talentedunicorn/todone/commit/de46ab5d2ce16b4ddb08bb55459a34c59203c7d9))
- add version display and release tooling ([abe5e51](https://github.com/talentedunicorn/todone/commit/abe5e51f2f9ffd49a9a563639b93e9c747913483))
- added spacing and grid display to TaskShell ([763561a](https://github.com/talentedunicorn/todone/commit/763561a7fceddb8ca17ab662b52c5ab2ef3f81c1))
- always show markdown editor; show task title in edit dialog title ([a4746ba](https://github.com/talentedunicorn/todone/commit/a4746bad675cceef64c820e69274a51a0ae02633))
- collapsible kanban columns for easier mobile navigation ([4d104b4](https://github.com/talentedunicorn/todone/commit/4d104b4da91b715da59c3ed751db2119fbbf3d43))
- display updatedAt timestamp on task cards and content viewer dialog ([cd05e2f](https://github.com/talentedunicorn/todone/commit/cd05e2fbcd91305a69946c16979a3c802473456c))
- FAB opens full-screen editor dialog; render markdown in KanbanCard ([040d18a](https://github.com/talentedunicorn/todone/commit/040d18a1b5d99fe51bbe3427cb76f6db8a8b0ebc))
- form fills remaining dialog space with flex column layout ([8c81dff](https://github.com/talentedunicorn/todone/commit/8c81dffb735e22b726f86f8941ffc756f7b83551))
- kanban horizontal scroll support ([f600096](https://github.com/talentedunicorn/todone/commit/f600096d4c16e281445b2c60debbb97e7f71e6e8))
- keep search always visible and restore original status on undo ([1357bd2](https://github.com/talentedunicorn/todone/commit/1357bd23878ddebbf9431d1085bb2410ed15622c))
- remove archive, make kanban a protected route ([e362fb7](https://github.com/talentedunicorn/todone/commit/e362fb7349c3dc2390b8b06b6aea3747ee2e658a))
- replace completed:boolean with status enum in data model ([00907db](https://github.com/talentedunicorn/todone/commit/00907db6f40e89ee7b7c38c7c3e6bf6734e184c6))
- replace tab-based list with three-column kanban view ([101b4e5](https://github.com/talentedunicorn/todone/commit/101b4e52db8499c6c9d1b822ee3c0f4962751e43))
- route-based navigation with /, /kanban, /archive ([f0659aa](https://github.com/talentedunicorn/todone/commit/f0659aa4157333e7d9fe24de246dedf8c4f96a8f))
- **storybook:** add edge-case stories for Button component ([f7e1687](https://github.com/talentedunicorn/todone/commit/f7e168783c8597bf08b661f7abf95e53b380cb57))
- **storybook:** add edge-case stories for FlatList and KanbanView ([372c752](https://github.com/talentedunicorn/todone/commit/372c752609e55446ba0160c1d146800144af77dc))
- **storybook:** add edge-case stories for KanbanCard ([dac055b](https://github.com/talentedunicorn/todone/commit/dac055b8fa3f15a897205e2382fc582ba754d413))
- **storybook:** add edge-case stories for Toast ([5f45285](https://github.com/talentedunicorn/todone/commit/5f45285e65c2fd791857a02c1ba73a918006e0ef))
- **storybook:** add layout parameters for better Storybook UI ([199c929](https://github.com/talentedunicorn/todone/commit/199c929c7839619962ae201e233309021d4f20a6))
- unified route with view toggle, RxDB-level sort+search+pagination ([e39aef3](https://github.com/talentedunicorn/todone/commit/e39aef3fb6882e4c09f29bd82b2b7019f5c7a037))
- update UI components to use status instead of completed ([88f5ff8](https://github.com/talentedunicorn/todone/commit/88f5ff844e74912848de1fa1cf70770f6af0fb36))
- wire onView through routes ([304184f](https://github.com/talentedunicorn/todone/commit/304184fcba2647a9b6eaee22cb462f17c2e13c26))

### Bug Fixes

- add maxLength to status field in RxDB schema ([145d97d](https://github.com/talentedunicorn/todone/commit/145d97d29b2c7f044e839056359d288c94511b0b))
- align controls to top on flat list and allow word-wrap ([97b4f31](https://github.com/talentedunicorn/todone/commit/97b4f313324d86dd82a50f0f920e06020d2f7a47))
- break word on code tags ([d112424](https://github.com/talentedunicorn/todone/commit/d1124245c4fefffc3044d47baa2ac2c7b206bb27))
- buttons clipped on small screens ([8210de4](https://github.com/talentedunicorn/todone/commit/8210de44d0facdd31793eebde106dd46081d5f87))
- chevron direction convention and dark theme column background ([f6d8d9c](https://github.com/talentedunicorn/todone/commit/f6d8d9ca44e809a28c1f182fe9a9a21a46e70f7e))
- clipped editor on small screens ([3211d82](https://github.com/talentedunicorn/todone/commit/3211d82f5be8a8f53c6c970c4188f4f4316a1a94))
- FlatList component and story — immutable sort and flexible text matcher ([a8a11dc](https://github.com/talentedunicorn/todone/commit/a8a11dc3ab9511e86a0632bc8baeb4e12811633d))
- FlatList stories rendering - add aria-labels and wait for async markdown ([5f0df9b](https://github.com/talentedunicorn/todone/commit/5f0df9b60bdda4eb6777360345dbe7c5871e1c36))
- handle CouchDB 401 more robustly in fetchWithAuth ([2510f3f](https://github.com/talentedunicorn/todone/commit/2510f3f25852e0cbf71f1f72b5bc0616d4e6994a))
- inline SVG in ToggleTheme to restore icon visibility ([7a3279a](https://github.com/talentedunicorn/todone/commit/7a3279a7f1a2ffc60673442fd5aa5d91843a01c3))
- KanbanColumn stories ([8249ee5](https://github.com/talentedunicorn/todone/commit/8249ee521d52779b97ec41b494a60520d4fbe834))
- KanbanView Empty story — use getAllByText for 'No tasks' ([add86be](https://github.com/talentedunicorn/todone/commit/add86bef95bc5c77dccf002f539a56b6a621c68b))
- KanbanView Expanded task play — target correct card's toggle ([2077e02](https://github.com/talentedunicorn/todone/commit/2077e02d531e15b6561d8029e315fe0bcbd08e50))
- KanbanView stories — waitFor async markdown and function matchers ([5461e28](https://github.com/talentedunicorn/todone/commit/5461e2815400c8dd64d4ba3f909f0c36dc686090))
- keep viewTask in sync with RxDB updates so status toggle in ContentViewDialog works ([fe205a5](https://github.com/talentedunicorn/todone/commit/fe205a5264ee48629879c053f9ab4d9946dfc881))
- made thead white-space nowrap and aligned forms ([ecd0857](https://github.com/talentedunicorn/todone/commit/ecd08576aca01f236d0e8a0aba33b1fe1c138e97))
- MarkdownContent stories ([644eb8c](https://github.com/talentedunicorn/todone/commit/644eb8cfa74a0eacf5a71fa58ca371813adffc61))
- Menu.stories.svelte - replace non-existent menuItems/goTo props with children snippet ([4f106e9](https://github.com/talentedunicorn/todone/commit/4f106e9b35a4884a4309e1a977a4e2a94c4cdcce))
- pagination control stories ([4cfab09](https://github.com/talentedunicorn/todone/commit/4cfab09e0673c535c765bae0076d43d9f3c4d982))
- prevent keyboard shortcuts from typing into inputs + add content viewer ([cfa5403](https://github.com/talentedunicorn/todone/commit/cfa54037c5c8fb6d39596bfbb601cfe82f0ca2bc))
- prevent pre and code overflow in ContentViewDialog ([b461455](https://github.com/talentedunicorn/todone/commit/b4614551feac317ff8cdc2b6ce4f9c02e0990051))
- removed bottom border on dialog header ([b2c0eb4](https://github.com/talentedunicorn/todone/commit/b2c0eb42b0649823d946619442bbf34eba7645b7))
- removed min-height on kanban ([7bb2387](https://github.com/talentedunicorn/todone/commit/7bb238755ccc50fe3724ee502da782f224c040a8))
- removed title on new items and reduce padding on dialog-header ([b812881](https://github.com/talentedunicorn/todone/commit/b8128817461d6ebdd5f9a59c36aa26e1ad496f91))
- Replace article with div in Flatlist to allow mouse events ([11d999d](https://github.com/talentedunicorn/todone/commit/11d999dae338c5242b86536aeb399f6db30617d7))
- replace function matchers with role/string queries to avoid instrumenter bug ([350847c](https://github.com/talentedunicorn/todone/commit/350847cdaff784162cb33044be31dced656c772e))
- restore .inner overflow wrapper and add flex-shrink:0 for toolbar menu on small screens ([43b4001](https://github.com/talentedunicorn/todone/commit/43b400193c474db6334ccc153939308bb6b543ac))
- scroll overflowing tables in MarkdownContent ([7c5f3b1](https://github.com/talentedunicorn/todone/commit/7c5f3b12c9fbe13b4522b8ae83a51f8c3e292815))
- search not filtering — Svelte 5 $effect dep tracking and RxDB allowSlowCount ([40e7b48](https://github.com/talentedunicorn/todone/commit/40e7b488bb65f92c2af8d02d557fa4a62a3432e7))
- **storybook:** add component and play function to ExportImport story ([7d614c2](https://github.com/talentedunicorn/todone/commit/7d614c2c4627a1e35b34e5a9e7495213c912ab38))
- **storybook:** add component, args, and play functions to KanbanColumn stories ([a6b7bfd](https://github.com/talentedunicorn/todone/commit/a6b7bfd695393d06c6dc9718009408c760329043))
- **storybook:** add component, args, and template pattern to KanbanCard stories ([9b7cb24](https://github.com/talentedunicorn/todone/commit/9b7cb244e1d457f3226558378e023f568664330d))
- **storybook:** add component, move spies to module, add play function to TaskShell story ([c295590](https://github.com/talentedunicorn/todone/commit/c2955902808af5d05f7a98980c0c1b85f7ea952b))
- **storybook:** add missing lang='ts' to story script modules ([c847b7a](https://github.com/talentedunicorn/todone/commit/c847b7a7a5d39a3e6a49902279a2afa69d6d8c77))
- **storybook:** add template pattern and play functions to MarkdownContent ([a550e60](https://github.com/talentedunicorn/todone/commit/a550e60c73aafc83f499b2261f7f381554f9d447))
- **storybook:** add template pattern, argTypes, and play functions to FullScreenEditor ([09e0a32](https://github.com/talentedunicorn/todone/commit/09e0a3276c6a6622d73bb2d6acb2dcebe18e9aa3))
- **storybook:** add template, layout, and play function to Fab story ([7487920](https://github.com/talentedunicorn/todone/commit/74879203fd62a13ab508edf007be75c1cd798702))
- **storybook:** suppress autodocs for EditorIcons gallery story ([a26f4bf](https://github.com/talentedunicorn/todone/commit/a26f4bf9364f492274acfa730dd180d62a57af0a))
- update About.svelte overview for new status model ([c8c6dcc](https://github.com/talentedunicorn/todone/commit/c8c6dcc2a06e5be33879d3d43465d61c5ff1cf0c))
- update dependencies and resolve security vulnerabilities ([#576](https://github.com/talentedunicorn/todone/issues/576)) ([e02c6bc](https://github.com/talentedunicorn/todone/commit/e02c6bc8dcc8498d63841dd80ff0e5496405773a))
- update form controls layout and button styles ([381ea63](https://github.com/talentedunicorn/todone/commit/381ea63036b9e90924179ad37abafa15214cbc5b))
- update spacing for ToolbarActions ([1f48606](https://github.com/talentedunicorn/todone/commit/1f4860624fca7e190314c95279b354c279d865e3))
- use --black for all column text colors ([54259a5](https://github.com/talentedunicorn/todone/commit/54259a5b5c4619adbb060de4be97966ba3ccb0ea))
- use --black for modal title and close button colors ([f8eb379](https://github.com/talentedunicorn/todone/commit/f8eb3795571b6681ff364e2954f2648f95feffd1))
- use findBy\* queries in story play functions to handle async rendering ([b5f5dae](https://github.com/talentedunicorn/todone/commit/b5f5dae4e2b992fd9b9bef2c0051c766f99a7fd9))

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
