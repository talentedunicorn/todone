<script lang="ts">
	import { Auth0Client } from '@auth0/auth0-spa-js';

	import Button from '../components/Button.svelte';
	import { login } from '../auth';
	import userStore from '../stores/user';
	import { title } from '../lib/helpers';
	const { auth0: auth0Client } = $props<{ auth0: () => Auth0Client | undefined }>();

	let auth0 = auth0Client();
</script>

<svelte:head>
	<title>{title()}</title>
</svelte:head>

<main class="Login">
	{#if $userStore.isLoggedIn}
		<p>You are already logged in.</p>
	{:else}
		<Button onclick={() => login(auth0)}>Log in</Button>
	{/if}
</main>

<style>
	.Login {
		padding: 2rem;
	}
</style>
