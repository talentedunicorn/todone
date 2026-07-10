/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="vite-plugin-pwa/info" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
	readonly VITE_SYNCED: string;
	readonly VITE_GA_TAG: string;
	readonly VITE_UMAMI_SITEID: string;
	readonly VITE_DB_NAME: string;
	readonly VITE_REMOTE_DB: string;
	readonly VITE_AUTH0_CLIENT: string;
	readonly VITE_AUTH0_DOMAIN: string;
	readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
