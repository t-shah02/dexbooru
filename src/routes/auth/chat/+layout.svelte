<script lang="ts">
	import FriendSidebar from '$lib/components/chat/FriendSidebar.svelte';
	import { footerData, navbarData } from '$lib/stores/components';
	import { authenticatedUser } from '$lib/stores/userStores';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;

	let friends = data.friends;
	let roomId = $page.params.roomid;

	$: {
		roomId = $page.params.roomid;
	}

	const userDestroy = authenticatedUser.subscribe((user) => {
		if (user) {
			friends = user.friends;
		}
	});

	onDestroy(userDestroy);
</script>

<div style="top: {$navbarData.height}px; bottom: {$footerData.height}px" class="flex w-full fixed">
	<FriendSidebar {friends} roomId={roomId || ''} />
	<slot />
</div>
