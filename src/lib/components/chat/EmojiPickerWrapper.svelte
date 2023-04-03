<script lang="ts">
	import Emoji from '../svgs/Emoji.svelte';
	import EmojiSelector from 'svelte-emoji-picker';
	import type { FormEventHandler } from '$lib/interfaces/inputs';

	export let message: string;
	let showEmojiPicker = false;

	const onEmoji = (event) => {
		message += event.detail;
	};
</script>

<button
	on:click={() => (showEmojiPicker = !showEmojiPicker)}
	type="button"
	class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
>
	<Emoji />
	<span class="sr-only">Add emoji</span>
</button>

{#if showEmojiPicker}
	<EmojiSelector on:emoji={onEmoji} />
{/if}
