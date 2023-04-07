<script lang="ts">
	import LoadingSpinner from '$lib/components/svgs/LoadingSpinner.svelte';
	import FailureAlert from '$lib/components/upload/FailureAlert.svelte';
	import ImageUploads from '$lib/components/upload/ImageUploads.svelte';
	import SuccessAlert from '$lib/components/upload/SuccessAlert.svelte';
	import TextualData from '$lib/components/upload/TextualData.svelte';
	import type { NewPostData, UploadFormResponse } from '$lib/interfaces/api';
	import { uploadPost } from '$lib/stores/uploadStores';
	import { authenticatedUser, authenticatedUserPosts } from '$lib/stores/userStores';
	import type { Post } from '@prisma/client';
	import { onMount } from 'svelte';

	export let form: FormData;

	// form submission state variables
	let serverError = false;
	let errorMessage = '';
	let filesError: string[];
	let newPostData: NewPostData;
	let loading = false;

	const submitPost = async (event: Event) => {
		event.preventDefault();

		// instanstiate the form data object
		const formData = new FormData();

		const { files, tags, artists, nsfw } = $uploadPost;

		files.forEach((file) => {
			formData.append('files', file);
		});

		tags.forEach((tag) => {
			formData.append('tags', tag);
		});

		artists.forEach((artist) => {
			formData.append('artists', artist);
		});

		formData.set('nsfw', JSON.stringify(nsfw));

		const uploadRequest = new Request('/auth/upload?/newPost', {
			method: 'POST',
			body: formData
		});

		loading = true;
		const response = await fetch(uploadRequest);
		loading = false;

		if (!response.ok) {
			serverError = true;
			errorMessage = 'There was an internal server error!';
			return;
		}

		serverError = false;
		errorMessage = '';

		const formResponse: UploadFormResponse = await response.json();
		console.log(formResponse);
		const data = JSON.parse(formResponse.data);
		const newPost: Post = JSON.parse(data[1]);

		if (formResponse.status === 200) {
			newPostData = {
				postID: newPost.id,
				postURL: `/posts/view/${newPost.id}`
			};

			uploadPost.set({
				nsfw: false,
				tags: [],
				artists: [],
				files: [],
				imageMetadata: []
			});

			authenticatedUser.update((authUser) => {
				if (authUser) {
					authUser.posts.push({
						postId: newPost.id,
						images: newPost.images,
						authorName: authUser.username,
						authorProfileUrl: authUser.profilePictureUrl,
						views: newPost.views,
						nsfw: newPost.nsfw,
						date: new Date(newPost.createdAt),
						tags,
						artists
					});
				}

				return authUser;
			});
		} else {
			errorMessage = data[1] as string;
		}
	};

	onMount(() => {
		window.onkeydown = (event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
			}
		};
	});
</script>

<svelte:head>
	<title>Upload</title>
</svelte:head>

<form
	class="mt-20 mb-20 flex flex-col"
	on:submit={submitPost}
	method="POST"
	enctype="multipart/form-data"
>
	<h1 class="upload-title format text-center">Upload a post</h1>

	<ImageUploads />
	<TextualData />

	{#if !serverError && newPostData}
		<SuccessAlert postID={newPostData.postID} postURL={newPostData.postURL} />
	{/if}

	{#if errorMessage.length}
		<FailureAlert message={errorMessage} />
	{/if}

	{#if loading}
		<div class="flex justify-center">
			<LoadingSpinner />
		</div>
	{:else}
		<button
			type="submit"
			class="text-white block m-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Upload</button
		>
	{/if}
</form>

<style>
	.upload-title {
		font-size: 25px;
	}
</style>
