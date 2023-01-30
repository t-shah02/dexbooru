<script lang="ts">
	import MarkdownModal from './MarkdownModal.svelte';
	import { MAXIMUM_COMMENT_LENGTH } from '$lib/comments/commentConstants';
	import MarkdownIt from 'markdown-it';
	import MarkdownEmoji from 'markdown-it-emoji';

	import sanitizeHtml from 'sanitize-html';
	import { fade } from 'svelte/transition';
	import type { FormEventHandler } from '$lib/interfaces/inputs';

	const md = new MarkdownIt();
	md.use(MarkdownEmoji);

	type CommentType = 'Text' | 'Markdown';

	let comment = '';
	let markdownComment = '';
	let commentType: CommentType = 'Text';

	const onCommentChange = () => {
		if (commentType === 'Markdown') {
			markdownComment = sanitizeHtml(md.render(comment), {
				allowedTags: ['p', 'h1', 'img', 'strong', 'em', 'span']
			});
		}
	};

	const onCommentTypeChange = (event: FormEventHandler<HTMLSelectElement>) => {
		const target = event.target as HTMLSelectElement;
		const type = target.value as CommentType;

		if (type === 'Markdown') {
			markdownComment = sanitizeHtml(md.render(comment), {
				allowedTags: ['p', 'h1', 'img', 'strong', 'em', 'span']
			});
		}
	};
</script>

<section class="comment-box">
	<div>
		<textarea
			bind:value={comment}
			on:input={onCommentChange}
			maxlength={MAXIMUM_COMMENT_LENGTH}
			rows="3"
			placeholder="Leave a comment"
		/>
		<h6 class="comment-length block text-right">{comment.length}/{MAXIMUM_COMMENT_LENGTH}</h6>
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
		<button class="button comment-btn">Comment</button>
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
