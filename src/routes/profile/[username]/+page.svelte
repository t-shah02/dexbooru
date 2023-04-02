<script lang="ts">
	import InfoCard from '$lib/components/profile/InfoCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const friendData = data.friendData;

	const { targetUser, sameUser } = data;
</script>

<svelte:head>
	<title>Profile - {targetUser.username}</title>
</svelte:head>

<InfoCard friendStatus={friendData} user={targetUser} {sameUser} />
