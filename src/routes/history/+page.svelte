<script lang="ts">
	import { onMount } from 'svelte';
	import type { History, Post } from '$lib/interfaces/posts';
	import Timeline from '$lib/components/history/Timeline.svelte';

	let history: History = [];

	onMount(() => {
		history = JSON.parse(localStorage.getItem('history') || '[]');
	});
</script>

<Timeline />
