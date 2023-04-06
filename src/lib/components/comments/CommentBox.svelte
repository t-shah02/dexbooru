<script lang="ts">
	import { MAXIMUM_COMMENT_LENGTH } from '$lib/comments/commentConstants';
	import type { Comment, CommentBody } from '$lib/interfaces/comments';
	import { commentTree } from '$lib/stores/commentStores';
	import { fade } from 'svelte/transition';
	import MessageToast from '../MessageToast.svelte';
	import LoadingSpinner from '../svgs/LoadingSpinner.svelte';
	import MarkdownPreview from './MarkdownPreview.svelte';

	export let postID: string;
	export let parentCommentID: string | null = null;
	export let showCommentBox: boolean = true;
	export let boxPlaceholder: string = 'Leave a comment on this post :))';

	let comment: string = '';
	let loading = false;
	let errorPostingComment = false;

	const submitComment = async () => {
		const commentBody: CommentBody = {
			content: comment,
			parentCommentID: parentCommentID || 'null',
			postID
		};

		loading = true;
		const response = await fetch('/api/comments/create', {
			method: 'POST',
			body: JSON.stringify(commentBody)
		});

		loading = false;

		if (response.ok) {
			errorPostingComment = false;
			const newComment: Comment = await response.json();
			newComment.createdAt = new Date(newComment.createdAt);

			commentTree.update((currentTree) => {
				if (newComment.parentCommentID === null) {
					const rootComments = currentTree.get('/') || [];
					rootComments.push(newComment);

					currentTree.set('/', rootComments);
				} else {
					const parentComments = currentTree.get(newComment.parentCommentID) || [];
					parentComments.push(newComment);

					currentTree.set(newComment.parentCommentID, parentComments);
				}

				return currentTree;
			});

			showCommentBox = false;
		} else {
			errorPostingComment = true;

			setTimeout(() => (errorPostingComment = false), 3500);
		}
	};
</script>

<div
	class="comment-box mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
>
	<div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
		<label for="comment" class="sr-only">Your comment</label>
		<textarea
			bind:value={comment}
			name="comment"
			id="comment"
			rows="4"
			class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
			placeholder={boxPlaceholder}
			required
		/>
	</div>
	<div class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
		<button
			disabled={loading}
			on:click={submitComment}
			class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
		>
			Comment
			{#if loading}
				<div class="ml-2">
					<LoadingSpinner />
				</div>
			{/if}
		</button>
		{#if errorPostingComment}
			<div
				out:fade
				class="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
				role="alert"
			>
				<span class="font-medium">Comment error!</span> Make sure the comment is between 1 and {MAXIMUM_COMMENT_LENGTH}
				characters long
			</div>
		{/if}
		<MarkdownPreview {comment} />
	</div>
</div>
