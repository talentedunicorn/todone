<script lang="ts">
	import Button from '../components/Button.svelte';
	import { login } from '../auth';
	import { isLoggedin } from '../stores';
	import { getAuth0Client } from '../lib/auth-client';

	let auth0 = getAuth0Client;
</script>

<svelte:head>
	<title>Login to continue &#8212; Get it done!</title>
</svelte:head>

<main class="Login">
	{#if $isLoggedin}
		<p>You are already logged in.</p>
	{:else}
		<Button onclick={() => auth0() && login(auth0()!)}>Log in</Button>
	{/if}
</main>

<style>
	.Login {
		padding: 2rem;
	}
</style>
