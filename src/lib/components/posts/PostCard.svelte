<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import type { Post } from '$lib/interfaces/posts';
	import { authenticatedUser } from '$lib/stores/userStores';
	import MessageToast from '../MessageToast.svelte';
	import LoadingSpinner from '../svgs/LoadingSpinner.svelte';
	import DeletePostModal from './DeletePostModal.svelte';

	export let postId: string;
	export let date: Date;
	export let views: number;
	export let images: string[];
	export let authorName: string;
	export let nsfw: boolean;
	export let tags: string[];
	export let artists: string[];
	export let isSaved: boolean;
	export let postRef: Post;
	export let editMode: boolean = false;

	$: {
		prettyDate = prettifyDate(date);
		isBlurred = nsfw;
	}

	let isBlurred = nsfw;
	let prettyDate = '';
	let imageIndex = 0;
	let saving = false;
	let canSave = true;
	let toggledSave = false;
	let toggleSaveErrored = false;
	let currentSaveAction = '';
	let savedWhileDelayed = false;

	const goLeft = () => {
		imageIndex = imageIndex - 1 < 0 ? images.length - 1 : imageIndex - 1;
	};

	const goRight = () => {
		imageIndex = imageIndex + 1 == images.length ? 0 : imageIndex + 1;
	};

	const toggleSaveUnsave = async (event: FormEventHandler<HTMLButtonElement>) => {
		if (!canSave) {
			savedWhileDelayed = true;
			return;
		}

		const target = event.target as HTMLButtonElement;
		const action = target.dataset.action as 'save' | 'unsave';

		currentSaveAction = action === 'save' ? 'saved' : 'unsaved';
		saving = true;
		savedWhileDelayed = false;

		const response = await fetch('/api/posts/save', {
			method: 'POST',
			body: JSON.stringify({ action, postId })
		});

		saving = false;

		if (response.ok) {
			isSaved = !isSaved;
			toggledSave = true;
			toggleSaveErrored = false;

			if ($authenticatedUser) {
				if (action === 'save') {
					$authenticatedUser?.savedPosts.push(postRef);
				} else {
					$authenticatedUser.savedPosts = $authenticatedUser?.savedPosts.filter(
						(post) => post.postId !== postId
					);
				}

				authenticatedUser.set($authenticatedUser);
			}
		} else {
			toggledSave = false;
			toggleSaveErrored = true;
		}

		canSave = false;

		setTimeout(() => {
			canSave = true;
		}, 6500);
	};

	const postUrl = `/posts/view/${postId}`;
	const authorUrl = `/profile/${authorName}`;
</script>

<div
	class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
	<a class="relative" href={postUrl}>
		{#if isBlurred}
			<div
				class="nsfw-blocker block bg-black text-red-800 border-red-300 rounded-t-lg dark:text-red-400 dark:border-red-800"
			>
				<div class="flex items-center">
					<svg
						aria-hidden="true"
						class="w-5 h-5 mr-2"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/></svg
					>
					<span class="sr-only">Info</span>
					<h3 class="text-lg font-medium">Post is NSFW, press Unblur</h3>
				</div>
			</div>
		{/if}
		<img
			class="rounded-t-lg w-full current-image"
			src={images[imageIndex]}
			alt={tags.join(',') + artists.join(',') + ` image #${imageIndex + 1}`}
		/>
	</a>

	<div class="p-5">
		{#if images.length > 1}
			<div class="flex justify-center">
				<button
					on:click={goLeft}
					type="button"
					class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					<i class="fa-solid fa-arrow-left" />
				</button>
				<button
					on:click={goRight}
					type="button"
					class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					<i class="fa-solid fa-arrow-right" />
				</button>
			</div>
		{/if}
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			<a href={authorUrl} class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
				>{authorName}</a
			>
			@ {prettyDate}
		</h5>

		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
			Views: {views}
		</p>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
			Total images: {images.length}
		</p>

		<div class="flex flex-wrap">
			{#if nsfw}
				<button
					on:click={() => (isBlurred = !isBlurred)}
					type="button"
					class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
					>{isBlurred ? 'Unblur' : 'Blur'}</button
				>
			{/if}

			{#if $authenticatedUser}
				<button
					type="button"
					data-action={isSaved ? 'unsave' : 'save'}
					on:click={toggleSaveUnsave}
					class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
					>{isSaved ? 'Unsave Post' : 'Save Post'}
				</button>
				{#if editMode}
					<DeletePostModal {postId} />
				{/if}
			{/if}

			<button
				type="button"
				class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
				>Report post</button
			>
		</div>
	</div>

	<div class="flex flex-col w-full items-center">
		{#if savedWhileDelayed}
			<MessageToast type="error" message="Please wait for a little bit, before doing this!" />
		{/if}

		{#if toggledSave}
			<MessageToast type="success" message="This post was {currentSaveAction} successfully!" />
		{/if}

		{#if toggleSaveErrored}
			<MessageToast type="error" message="An error occured while saving/unsaving this post!" />
		{/if}

		{#if saving}
			<LoadingSpinner />
		{/if}
	</div>
</div>

<style>
	.nsfw-blocker {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
	}
</style>
