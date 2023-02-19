<script lang="ts">
	import InfoCard from '$lib/components/profile/InfoCard.svelte';
	import ProfilePictureReset from '$lib/components/profile/forms/ProfilePictureReset.svelte';
	import UsernameReset from '$lib/components/profile/forms/UsernameReset.svelte';
	import PasswordReset from '$lib/components/profile/forms/PasswordReset.svelte';
	import type { PageData } from './$types';
	import { authenticatedUser } from '$lib/stores/userStores';
	import Tabs from '$lib/components/profile/Tabs.svelte';

	export let data: PageData;
	export let form: FormData;

	const { targetUser, sameUser } = data;
</script>

<svelte:head>
	<title>Profile - {targetUser.username}</title>
</svelte:head>

<InfoCard user={targetUser} {sameUser} />

{#if $authenticatedUser && $authenticatedUser.id === targetUser.id}
	<div class="settings flex flex-wrap mt-5 mb-20 justify-center">
		<UsernameReset errorMessage={form ? form.message : ''} />
		<ProfilePictureReset />
		<PasswordReset context={form ? form.context : ''} message={form ? form.message : ''} />
	</div>
{/if}

<style>
	.settings {
		width: 100%;
	}
</style>
