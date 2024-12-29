![Logo](public/logo.svg)

# ToDone

> An offline-first ToDo list pwa build on [Svelte](https://svelte.dev)

## Features

- Offline-first
- Markdown support
- Synced with Couchdb or Pouchdb (Self hosted)
- [Auth0](https://auth0.com/) authentication for synced mode
- Export/Import of data

## Building

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

### Environment variables

- `VITE_SYNCED` to be set `true` or `false`
- `VITE_GA_TAG` for Google Analytics tag
- `VITE_DB_NAME` the pouchdb database name
- `VITE_REMOTE_DB` remote pouchdb/couchdb database url. Required `VITE_SYNCED` to be `true`
- `VITE_AUTH0_CLIENT` [Auth0](https://auth0.com/) client id
- `VITE_AUTH0_DOMAIN` [Auth0](https://auth0.com/) domain
