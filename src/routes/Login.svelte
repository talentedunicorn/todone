<script lang="ts">
	import { Auth0Client } from '@auth0/auth0-spa-js';

	import Button from '../components/Button.svelte';
	import { login } from '../auth';
	import { isLoggedin } from '../stores';

	const { auth0: auth0Client } = $props<{ auth0: () => Auth0Client | undefined }>();

	let auth0 = () => auth0Client();
</script>

<svelte:head>
	<title>Login to continue &#8212; Get it done!</title>
</svelte:head>

<main class="Login">
	{#if $isLoggedin}
		<p>You are already logged in.</p>
	{:else}
		<Button onclick={() => login(auth0())}>Log in</Button>
	{/if}
</main>

<style>
	.Login {
		padding: 2rem;
	}
</style>
