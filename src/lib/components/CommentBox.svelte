<script lang="ts">
	import { MAXIMUM_COMMENT_LENGTH } from '$lib/comments/commentConstants';
	let comment = '';
</script>

<section class="comment-box">
	<div>
		<textarea
			bind:value={comment}
			maxlength={MAXIMUM_COMMENT_LENGTH}
            rows="3"
			placeholder="Leave a comment"
		/>
		<h6 class="comment-length block text-right">{comment.length}/{MAXIMUM_COMMENT_LENGTH}</h6>
	</div>

	<div class="comment-controls flex align-middle">
		<button class="button comment-btn">Comment</button>
	</div>
</section>

<style>

    .comment-box {
        margin-top : 10px;
    }

	.comment-controls {
		margin-top: 10px;
	}

	.comment-btn {
		margin-left: auto;
        margin-right : 0;
	}

	textarea {
		width: 100%;
		padding: 7.5px;
		resize: none;
		border-radius: 2.5px;
	}
</style>
