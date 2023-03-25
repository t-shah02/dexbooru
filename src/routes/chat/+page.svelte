<script lang="ts">
	import MessageToast from '$lib/components/MessageToast.svelte';
	import chatSocket from '$lib/sockets/config';
	import { onMount } from 'svelte';

	let chatMessage = '';
	let messages: string[] = [];

	const sendChatMessage = () => {
		chatSocket.emit('chat message', JSON.stringify({ content: chatMessage }));
	};

	onMount(() => {
		chatSocket.on('chat message', (data) => {
			console.log('running');
			const parsed = JSON.parse(data);
			messages = [...messages, parsed.content as string];
		});
	});     
    



</script>

<h1>Chat</h1>

<input placeholder="Enter a chat message" bind:value={chatMessage} />
<button on:click={sendChatMessage}>Send</button>

<div class="flex" style="color: white">
	{#each messages as message}
		<h1>{message}</h1>
	{/each}
</div>
