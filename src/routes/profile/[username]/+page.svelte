<script lang="ts">
	import InfoCard from '$lib/components/profile/InfoCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const friendData = data.friendData;

	const { targetUser, sameUser } = data;
</script>

<svelte:head>
	<title>Profile - {targetUser.username}</title>
	<meta
		name="description"
		content="This is the profile page of {targetUser.username}. Registered users can send them a friend request, if they wish to do so."
	/>
	<meta property="og:title" content="Profile - {targetUser.username}" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="/profile/{targetUser.username}" />
	<meta property="og:image" content={targetUser.profilePictureUrl} />
</svelte:head>

<InfoCard friendStatus={friendData} user={targetUser} {sameUser} />
