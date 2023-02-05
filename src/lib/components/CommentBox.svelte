<script lang="ts">
	import MarkdownModal from './MarkdownModal.svelte';
	import { MAXIMUM_COMMENT_LENGTH } from '$lib/comments/commentConstants';
	import { convertAndCleanRawMD } from '$lib/comments/markdownHelpers';
	import { fade } from 'svelte/transition';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import type { CommentBody, Comment } from '$lib/interfaces/comments';
	import { commentTree } from '$lib/stores/commentStores';

	export let postID: string;
	export let parentCommentID: string | null;

	type CommentType = 'Text' | 'Markdown';

	let textComment = '';
	let markdownComment = '';
	let commentType: CommentType = 'Text';

	const onCommentChange = () => {
		if (commentType === 'Markdown') {
			markdownComment = convertAndCleanRawMD(textComment);
		}
	};

	const onCommentTypeChange = (event: FormEventHandler<HTMLSelectElement>) => {
		const target = event.target as HTMLSelectElement;
		const type = target.value as CommentType;

		if (type === 'Markdown') {
			markdownComment = convertAndCleanRawMD(textComment);
		}
	};

	const onCommentClick = async () => {
		const content = commentType === 'Markdown' ? markdownComment : textComment;
		if (content) {
			const body: CommentBody =
				parentCommentID != null ? { content, postID, parentCommentID } : { content, postID };

			const response = await fetch('/auth/comments/create', {
				method: 'POST',
				body: JSON.stringify(body)
			});

			if (response.ok) {
				const postedComment: Comment = await response.json();
				postedComment.createdAt = new Date(postedComment.createdAt);

				if (parentCommentID) {
					$commentTree.get(parentCommentID)?.push(postedComment);
				} else {
					$commentTree.get('/')?.push(postedComment);
				}

				commentTree.set($commentTree);
			}
		}
	};
</script>

<section class="comment-box">
	<div>
		<textarea
			bind:value={textComment}
			on:input={onCommentChange}
			maxlength={MAXIMUM_COMMENT_LENGTH}
			rows="3"
			placeholder="Leave a comment"
		/>
		<h6 class="comment-length block text-right">{textComment.length}/{MAXIMUM_COMMENT_LENGTH}</h6>
	</div>

	<div class="comment-controls flex align-middle">
		<div class="field label suffix small border">
			<select on:change={onCommentTypeChange} bind:value={commentType}>
				<option>Text</option>
				<option>Markdown</option>
			</select>
			<label class="active">Comment type</label>
			<i>arrow_drop_down</i>
		</div>
		{#if commentType === 'Markdown'}
			<button data-ui="#markdown-modal" in:fade class="button md-preview-btn">
				Preview markdown
			</button>
		{/if}
		<button on:click={onCommentClick} class="button comment-btn">Comment</button>
	</div>
</section>

{#if commentType === 'Markdown'}
	<MarkdownModal renderedMarkdown={markdownComment} />
{/if}

<style>
	.comment-box {
		margin-top: 10px;
	}

	.comment-controls {
		display: flex;
		justify-content: right;
		margin-top: 10px;
	}

	.comment-btn {
		background-color: mediumblue;
	}

	.md-preview-btn {
		background-color: mediumseagreen;
	}

	textarea {
		width: 100%;
		padding: 7.5px;
		resize: none;
		border-radius: 2.5px;
	}
</style>
