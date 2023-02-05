<script lang="ts">
	import { allComments, commentTree } from '$lib/stores/commentStores';
	import CommentContainer from '$lib/components/CommentContainer.svelte';
	import type { Comment } from '$lib/interfaces/comments';

	export let postID: string;

	function getIdToCommentMap(comments: Comment[]) {
		const commentMap = new Map<string, Comment>();

		comments.forEach((comment) => commentMap.set(comment.id, comment));
		return commentMap;
	}

	function makeCommentTree(
		comments: Comment[],
		parentID: string | null,
		commentTree: Map<string, Comment[]>
	) {
		if (!comments.length) return;

		const levelComments = comments.filter((comment) => comment.parentCommentID === parentID);
		const notLevelComments = comments.filter((comment) => comment.parentCommentID !== parentID);

		if (parentID) {
			commentTree.set(parentID, levelComments);
		} else {
			commentTree.set('/', levelComments);
		}

		for (const comment of levelComments) {
			makeCommentTree(notLevelComments, comment.id, commentTree);
		}
	}

	const commentTreeToBeFilled = new Map<string, Comment[]>();
	makeCommentTree($allComments, null, commentTreeToBeFilled);
	commentTree.set(commentTreeToBeFilled);

	let parentComments: Comment[] = $commentTree.get('/') || [];
</script>

<section class="post-comments-container">
	<h4>Comments</h4>

	{#if parentComments}
		{#each $commentTree.get('/') || [] as pc}
			<CommentContainer
				{postID}
				content={pc.content}
				createdAt={pc.createdAt}
				parentCommentID={null}
				id={pc.id}
				authorName={pc.author.username}
				authorProfileUrl={pc.author.profilePictureUrl}
				replies={$commentTree.get(pc.id) || []}
			/>
		{/each}
	{/if}
</section>

<style>
</style>
