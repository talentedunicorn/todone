<script lang="ts">
	import { Auth0Client } from '@auth0/auth0-spa-js';
	import { navigate } from 'svelte-routing';

	import Button from '../components/Button.svelte';
	import { isLoggedin } from '../stores';
	import { login } from '../auth';

	const { auth0 } = $props<{ auth0: Auth0Client | undefined }>();

	$effect(() => {
		// Navigate to homepage for valid sessions
		if ($isLoggedin) {
			navigate('/', { replace: true });
		}
	});
</script>

<svelte:head>
	<title>Login to continue &#8212; Get it done!</title>
</svelte:head>

<div class="Login">
	<Button onclick={() => login(auth0)}>Log in</Button>
</div>

<style>
	.Login {
		padding: 2rem;
	}
</style>
