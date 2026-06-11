<script lang="ts">
	import Button from '../components/Button.svelte';
	import { login } from '../auth';
	import { isLoggedin } from '../stores';
</script>

<svelte:head>
	<title>Login to continue &#8212; Get it done!</title>
</svelte:head>

<main class="Login">
	{#if $isLoggedin}
		<p>You are already logged in.</p>
	{:else}
		<Button onclick={login}>Log in</Button>
	{/if}
</main>

<style>
	.Login {
		padding: 2rem;
	}
</style>
