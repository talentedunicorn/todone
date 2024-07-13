import './app.css';
import App from './App.svelte';

import * as Sentry from '@sentry/svelte';

if (import.meta.env.MODE === 'production') {
	Sentry.init({
		dsn: import.meta.env.VITE_SENTRY_DSN,
		integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
		// Performance Monitoring
		tracesSampleRate: 1.0, //  Capture 100% of the transactions
		// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
		tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
		// Session Replay
		replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
		replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
	});
}

const app = new App({
	target: document.getElementById('app') as HTMLElement
});

export default app;
