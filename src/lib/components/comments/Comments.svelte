<script lang="ts">
	import type { Comment } from '$lib/interfaces/comments';
	import CommentBox from './CommentBox.svelte';
	import SingleComment from './Comment.svelte';
	import { commentTree } from '$lib/stores/commentStores';

	export let postID: string;
	export let comments: Comment[];

	const emptyTree = new Map<string, Comment[]>();

	function buildCommentTree(comments: Comment[], parentCommentID: string | null) {
		const children = comments.filter((comment) => comment.parentCommentID === parentCommentID);

		if (parentCommentID) {
			emptyTree.set(parentCommentID, children);
		} else {
			emptyTree.set('/', children);
		}

		children.forEach((child) => {
			buildCommentTree(comments, child.id);
		});
	}

	buildCommentTree(comments, null);

	commentTree.set(emptyTree);
</script>

<div class="mx-auto w-full">
	<CommentBox {postID} />
</div>

<h1
	class="mb-4 ml-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl  dark:text-white text-center"
>
	Comments
</h1>

<div class="space-y-5 comment-container w-full mt-10 mb-20">
	<ul>
		<li>
			{#each $commentTree.get('/') || [] as comment}
				<SingleComment {comment} {postID} />
			{/each}
		</li>
	</ul>
</div>

<style>
	.comment-container {
		margin-left: auto;
		margin-right: auto;
	}
</style>
