/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="vite-plugin-pwa/info" />

interface ImportMetaEnv {
	readonly VITE_SYNCED: string;
	readonly VITE_GA_TAG: string;
	readonly VITE_DB_NAME: string;
	readonly VITE_REMOTE_DB: string;
	readonly VITE_AUTH0_CLIENT: string;
	readonly VITE_AUTH0_DOMAIN: string;
	readonly VITE_SENTRY_DSN: string;
	readonly VITE_PAGE_LIMIT: number;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
