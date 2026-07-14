> Moved to https://gitlab.com/talentedunicorn/todo

[![Tests](https://github.com/talentedunicorn/todone/actions/workflows/tests.yml/badge.svg)](https://github.com/talentedunicorn/todone/actions/workflows/tests.yml)

![Logo](public/logo.svg)

# ToDone

> An offline-first ToDo list PWA built on [Svelte 5](https://svelte.dev)

## Features

- Offline-first — tasks are stored locally in [RxDB](https://rxdb.info) and the app works without a network connection
- Dual views — paginated list and drag-and-drop kanban board
- Markdown support for task content
- Keyboard shortcuts and undo on delete
- Optional sync to a self-hosted [CouchDB](https://couchdb.apache.org) server
- [Auth0](https://auth0.com/) authentication for synced mode
- Export/Import of data as JSON

## Development

Requires [Node.js](https://nodejs.org) 24+ and [pnpm](https://pnpm.io) (version pinned via `packageManager` in `package.json`).

```bash
pnpm install
pnpm dev
```

Copy `env.sample` to `.env` and adjust values as needed (see [Environment variables](#environment-variables)).

### Testing

Tests run with Vitest in a real browser via Playwright:

```bash
pnpm exec playwright install --with-deps # first run only
pnpm test
```

Component development uses Storybook:

```bash
pnpm storybook
```

## Building

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

### Environment variables

- `VITE_SYNCED` to be set `true` or `false`
- `VITE_DB_NAME` the local RxDB database name
- `VITE_REMOTE_DB` remote CouchDB database url. Requires `VITE_SYNCED` to be `true`
- `VITE_AUTH0_CLIENT` [Auth0](https://auth0.com/) client id. Required for synced mode
- `VITE_AUTH0_DOMAIN` [Auth0](https://auth0.com/) domain. Required for synced mode
- `VITE_GA_TAG` [Google Analytics](https://analytics.google.com) tag (optional)
- `VITE_UMAMI_SITEID` [Umami](https://umami.is) analytics site id (optional)
- `VITE_SENTRY_DSN` [Sentry](https://sentry.io) DSN for error reporting (optional, production builds only)
