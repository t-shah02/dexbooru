<script lang="ts">
	import { allComments } from '$lib/stores/commentStores';
</script>

<section class="post-comments-container">
	<h4>Comments</h4>
	{#each $allComments as comment}
		<h1>{JSON.stringify(comment)}</h1>
	{/each}
</section>
