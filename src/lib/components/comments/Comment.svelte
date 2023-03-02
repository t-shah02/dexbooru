<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import type { Comment } from '$lib/interfaces/comments';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { commentTree } from '$lib/stores/commentStores';
	import {  slide } from 'svelte/transition';
	import CommentBox from './CommentBox.svelte';

	export let comment: Comment;
	export let postID: string;

	let showCommentBox = false;
	let showReplies = false;


	const replies = $commentTree.get(comment.id) || [];

	const prettyDate = prettifyDate(comment.createdAt);

	const onReplyButtonClick = (event: FormEventHandler<HTMLButtonElement>) => {
		const target = event.target as HTMLButtonElement;
		const btnValue = target.innerText;

		if (btnValue === 'Reply') {
			showCommentBox = true;
		} else {
			showCommentBox = false;
		}
	};

	const onShowRepliesClick = (event: FormEventHandler<HTMLButtonElement>) => {
		const target = event.target as HTMLButtonElement;
		const btnValue = target.innerText;

		if (btnValue === 'Show replies') {
			showReplies = true;
		} else {
			showReplies = false;
		}
	};
</script>

<div class="max-w-sm p-6">
	<a href="/profile/{comment.author.username}" class="flex space-x-3">
		<img
			class="w-10 h-10 rounded-full"
			src={comment.author.profilePictureUrl}
			alt="profile of {comment.author.username}"
		/>
		<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
			{comment.author.username}
		</h5>
	</a>
	<p class="mt-3 mb-3 font-normal text-gray-500 dark:text-gray-400">
		{@html comment.content}
	</p>
	<p class="mt-3 mb-3 font-normal text-gray-500 dark:text-gray-400">
		{prettyDate}
	</p>
	<div class="flex">
		{#if replies.length > 0}
			<button
				on:click={onShowRepliesClick}
				type="button"
				class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>{showReplies ? 'Hide replies' : 'Show replies'}</button
			>
		{/if}
		<button
			on:click={onReplyButtonClick}
			type="button"
			class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>{showCommentBox ? 'Cancel' : 'Reply'}</button
		>
	</div>
	{#if showCommentBox}
		<div in:slide out:slide>
			<CommentBox {postID} parentCommentID={comment.id} />
		</div>
	{/if}

	{#if showReplies}
		<ul>
			<li class="border-l-2">
				{#each replies as reply}
					<svelte:self comment={reply} {postID} />
				{/each}
			</li>
		</ul>
	{/if}
</div>
