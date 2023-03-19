<script lang="ts">
	import InfoCard from '$lib/components/profile/InfoCard.svelte';
	import ProfilePictureReset from '$lib/components/profile/forms/ProfilePictureReset.svelte';
	import UsernameReset from '$lib/components/profile/forms/UsernameReset.svelte';
	import PasswordReset from '$lib/components/profile/forms/PasswordReset.svelte';
	import type { PageData, ActionData } from './$types';
	import { authenticatedUser } from '$lib/stores/userStores';
	import ProfileChangeToast from '$lib/components/MessageToast.svelte';

	export let data: PageData;
	export let form: ActionData = {};

	// form variables
	const type = form?.type;
	const message = form?.message;

	const { targetUser, sameUser } = data;
</script>

<svelte:head>
	<title>Profile - {targetUser.username}</title>
</svelte:head>

<InfoCard user={targetUser} {sameUser} />

{#if $authenticatedUser && $authenticatedUser.id === targetUser.id}
	{#if type && message}
		<ProfileChangeToast {type} {message} />
	{/if}
	<div class="settings flex flex-wrap mt-5 mb-20 justify-center">
		<UsernameReset />
		<ProfilePictureReset />
		<PasswordReset />
	</div>
{/if}

<style>
	.settings {
		width: 100%;
	}
</style>
