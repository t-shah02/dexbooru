<script lang="ts">
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData = {};
</script>

<svelte:head>
	<title>Log-in</title>
	<meta
		name="description"
		content="Log-in into Dexbooru today. Authenticated users can upload posts, leave comments on posts and even chat with other users based on friend requests."
	/>
	<meta property="og:title" content="Log-in to Dexbooru" />
	<meta
		property="og:description"
		content="Log-in into Dexbooru today. Authenticated users can upload posts, leave comments on posts and even chat with other users based on friend requests."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="/auth/login" />
</svelte:head>

<LoginForm errorMessage={form ? form.message : ''} />
