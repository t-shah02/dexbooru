<script lang="ts">
	import type { ActionData } from './$types';
	import RegisterForm from '$lib/components/auth/RegisterForm.svelte';

	export let form: ActionData = {};
</script>

<svelte:head>
	<title>Sign up</title>
	<meta
		name="description"
		content="Register an account in Dexbooru today. Authenticated users can upload posts, leave comments on posts and even chat with other users based on friend requests."
	/>
	<meta property="og:title" content="Sign-up for Dexbooru" />
	<meta
		property="og:description"
		content="Register an account in Dexbooru today. Authenticated users can upload posts, leave comments on posts and even chat with other users based on friend requests."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="/auth/signup" />
</svelte:head>

<RegisterForm errorMessage={form ? form.message : ''} />
