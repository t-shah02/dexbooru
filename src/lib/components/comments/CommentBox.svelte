<script lang="ts">
	import MarkdownPreview from './MarkdownPreview.svelte';

	export let postID: string;
	export let parentCommentID: string | null = null;

	let comment: string = '';
</script>

<form method="POST" action="?/comment">
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
				placeholder="Leave a comment on this post :))"
				required
			/>
		</div>
		<div class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
			<button
				type="submit"
				class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
			>
				Comment
			</button>
			<MarkdownPreview {comment} />
		</div>
	</div>
	<input type="hidden" value={postID} name="postID" />
	<input type="hidden" value={parentCommentID || ''} name="parentCommentID" />
</form>
