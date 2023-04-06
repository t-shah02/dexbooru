<script lang="ts">
	import { createPicker } from 'picmo';
	import { onMount } from 'svelte';
	import { noop } from 'svelte/internal';
	import Emoji from '../svgs/Emoji.svelte';

	export let message: string;

	type EmojiPicker = ReturnType<typeof createPicker>;

	let showPicker = false;
	let picker: EmojiPicker;
	let emojiContainer: HTMLElement;

	const displayPicker = () => {
		showPicker = !showPicker;
		if (showPicker) {
			emojiContainer.classList.remove('hidden');
		} else {
			emojiContainer.classList.add('hidden');
		}
	};

	onMount(() => {
		emojiContainer = document.querySelector('.emoji-picker-container') as HTMLElement;
		if (emojiContainer) {
			picker = createPicker({ rootElement: emojiContainer });
			picker.addEventListener('emoji:select', (event) => {
				message += event.emoji;
			});
		}
	});
</script>

<div class="emoji-container">
	<div class="hidden emoji-picker-container" />
	<button
		type="button"
		on:click={displayPicker}
		class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
	>
		<Emoji />
		<span class="sr-only">Add emoji</span>
	</button>
</div>

<style>
	.emoji-container {
		position: relative;
	}

	.emoji-picker-container {
		position: fixed;
		bottom: 130px;
	}
</style>
