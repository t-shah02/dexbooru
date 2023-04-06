<script lang="ts">
	import { onMount } from 'svelte';
	import Close from '../svgs/Close.svelte';
	import { Modal } from 'flowbite';
	import type { ModalOptions, ModalInterface } from 'flowbite';
	import LoadingSpinner from '../svgs/LoadingSpinner.svelte';
	import { authenticatedUser } from '$lib/stores/userStores';

	export let postId: string;

	let modal: ModalInterface | null = null;
	let loading = false;
	let deletedPost = false;

	const deletePost = async () => {
		loading = true;
		const response = await fetch(`/api/posts/delete`, {
			method: 'POST',
			body: JSON.stringify({ postId })
		});

		loading = false;
		deletedPost = response.ok;
	};

	onMount(() => {
		const deletePostModalPopup = document.querySelector(
			`#delete-post-popup-${postId}`
		) as HTMLElement;

		if (deletePostModalPopup) {
			const modalOptions: ModalOptions = {
				placement: 'center',
				backdrop: 'dynamic',
				backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
				closable: true,
				onHide: () => {
					if (deletedPost) {
						if ($authenticatedUser) {
							$authenticatedUser.savedPosts = $authenticatedUser.savedPosts.filter(
								(post) => post.postId !== postId
							);
							$authenticatedUser.posts = $authenticatedUser.posts.filter(
								(post) => post.postId !== postId
							);

							authenticatedUser.set($authenticatedUser);
						}
					}
				}
			};

			modal = new Modal(deletePostModalPopup, modalOptions);
		}
	});
</script>

<button
	id="delete-post-btn"
	class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
	type="button"
	on:click={() => {
		if (modal) {
			modal.show();
		}
	}}
>
	Delete post
</button>

<div
	id="delete-post-popup-{postId}"
	tabindex="-1"
	class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full"
>
	<div class="relative w-full h-full max-w-md md:h-auto">
		<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
			<button
				on:click={() => {
					if (modal) {
						modal.hide();
					}
				}}
				type="button"
				class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
			>
				<Close />
				<span class="sr-only">Close modal</span>
			</button>
			<div class="p-6 text-center">
				<svg
					aria-hidden="true"
					class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				{#if loading}
					<div class="m-auto">
						<LoadingSpinner />
					</div>
				{/if}

				{#if !deletedPost}
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						Are you sure you want to delete this post?
					</h3>
					<button
						on:click={deletePost}
						type="button"
						class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
					>
						Yes, I'm sure
					</button>
					<button
						on:click={() => {
							if (modal) {
								modal.hide();
							}
						}}
						type="button"
						class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
						>No, cancel</button
					>
				{:else}
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						The post was deleted successfully!
					</h3>
					<button
						on:click={() => {
							if (modal) {
								modal.hide();
							}
						}}
						type="button"
						class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
						>Close</button
					>
				{/if}
			</div>
		</div>
	</div>
</div>
