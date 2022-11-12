![Logo](static/logo.svg)

# ToDone

> An offline-first ToDo list pwa build on [Sveltekit](https://kit.svelte.dev)

## Features

- Offline-first
- Markdown support
- Synced with Couchdb or Pouchdb (Self hosted)
- [Auth0](https://auth0.com/) authentication for synced mode

## Building

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Environment variables

- `PUBLIC_SYNCED` to be set `true` or `false`
- `PUBLIC_GA_TAG` for Google Analytics tag
- `PUBLIC_DB_NAME` the pouchdb database name
- `PUBLIC_REMOTE_DB` pouchdb or couchdb database url. Required `PUBLIC_SYNCED` to be `true`
- `PUBLIC_AUTH0_CLIENT` [Auth0](https://auth0.com/) client id
- `PUBLIC_AUTH0_DOMAIN` [Auth0](https://auth0.com/) domain
