<script lang="ts">
	import { authenticatedUser } from '$lib/stores/userStores';
	import type { ActionData } from './$types';
	import ProfileChangeToast from '$lib/components/MessageToast.svelte';
	import ProfilePictureReset from '$lib/components/profile/forms/ProfilePictureReset.svelte';
	import UsernameReset from '$lib/components/profile/forms/UsernameReset.svelte';
	import PasswordReset from '$lib/components/profile/forms/PasswordReset.svelte';

	export let form: ActionData = {};

	// form variables
	const type = form?.type;
	const message = form?.message;
</script>

<div class="settings-heading-container w-full text-center">
	<h1
		class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
	>
		Settings
	</h1>
	<p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
		Change/modify your username, password or profile picture here!
	</p>
</div>

{#if $authenticatedUser}
	{#if type && message}
		<ProfileChangeToast {type} {message} />
	{/if}
	<div class="settings flex flex-wrap mb-20 justify-center">
		<UsernameReset />
		<ProfilePictureReset />
		<PasswordReset />
	</div>
{/if}

<style>
	.settings-heading-container {
		margin-top: 75px;
	}

	.settings {
		width: 100%;
	}
</style>
