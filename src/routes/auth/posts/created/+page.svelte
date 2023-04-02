<script lang="ts">
	import EmptyContainerAlert from '$lib/components/EmptyContainerAlert.svelte';
	import PostGrid from '$lib/components/posts/PostGrid.svelte';
	import { authenticatedUserPosts } from '$lib/stores/userStores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	authenticatedUserPosts.set(data.posts);
</script>

{#if $authenticatedUserPosts.length}
	<PostGrid
		posts={$authenticatedUserPosts}
		savedPosts={data.savedPostIds}
		marginBottom={150}
		editMode={true}
	/>
{:else}
	<EmptyContainerAlert
		heading={'No uploaded posts :\\'}
		subHeading={'Once you start uploading posts, they will appear on this page'}
		redirectLink={'/auth/posts/saved'}
		redirectLinkText={'Check out your saved posts'}
	/>
{/if}
