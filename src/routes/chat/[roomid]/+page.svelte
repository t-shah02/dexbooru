<script lang="ts">
	import type { PageData } from './$types';
	import ChatContainer from '$lib/components/chat/ChatContainer.svelte';

	export let data: PageData;
	const roomId = data.roomName;
	const partner = data.partner;
</script>

<ChatContainer {partner} {roomId} />
