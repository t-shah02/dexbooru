<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import type { Comment } from '$lib/interfaces/comments';
	import { commentTree } from '$lib/stores/commentStores';
	import { slide } from 'svelte/transition';
	import CommentBox from './CommentBox.svelte';

	export let content: string;
	export let createdAt: Date;
	export let parentCommentID: string | null;
	export let id: string;
	export let authorName: string;
	export let authorProfileUrl: string;
	export let replies: Comment[];
	export let postID: string;

	const prettyDate = prettifyDate(createdAt);
	let showReplies = false;
	let showReplyBox = false;

	function toggleView() {
		showReplies = !showReplies;
	}

	function toggleReplies() {
		showReplyBox = !showReplyBox;
	}
</script>

<article class="comment" in:slide out:slide>
	<div class="temp">
		<div class="flex">
			<div class="left">
				<h1 id="author">{authorName}</h1>
				<img class="circle tiny" src={authorProfileUrl} alt="no alt" />
			</div>
			<div class="right">
				<p id="content">{@html content}</p>
				<h4>{createdAt}</h4>
			</div>
		</div>
		<button on:click={toggleReplies}>{showReplyBox ? 'cancel' : 'reply'}</button>
		{#if showReplyBox}
			<div in:slide out:slide>
				<CommentBox {postID} {parentCommentID} />
			</div>
		{/if}
		{#if replies.length}
			<button on:click={toggleView}>{showReplies ? 'Hide replies' : 'Show replies'}</button>
		{/if}
		{#if showReplies}
			{#each replies as reply}
				<ul>
					<svelte:self
						{postID}
						content={reply.content}
						createdAt={reply.createdAt}
						parentCommentID={reply.parentCommentID}
						id={reply.id}
						authorName={reply.author.username}
						authorProfileUrl={reply.author.profilePictureUrl}
						replies={$commentTree.get(reply.id) || []}
					/>
				</ul>
			{/each}
		{/if}
	</div>
</article>

<style>
	.flex {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.left {
		margin-left: 5%;
		width: 30%;
	}
	.right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: center;
		width: 60%;
		margin-right: 5%;
	}
	.comment {
		text-align: center;
		width: 100%;
	}

	h1 {
		font-size: clamp(12px, 2vw, 24px);
	}

	h4 {
		font-size: clamp(6px, 1vw, 8px);
		align-self: center;
	}

	p {
		font-size: clamp(10px, 1.4vw, 16px);
	}

	button {
		font-size: clamp(10px, 1.4vw, 16px);
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.25em;
		list-style: none;
	}

	.temp {
		display: flex;
		flex-direction: column;
	}

	article {
		background-color: inherit !important;
	}
</style>
