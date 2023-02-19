<script lang="ts">
	import { getImageData } from '$lib/images/imageClient';
	import {
		MAXIMUM_IMAGE_WIDTH,
		MAXIMUM_IMAGE_HEIGHT,
		ACCEPTED_IMAGE_FORMATS,
		MAXIMUM_NUMBER_OF_IMAGES_FREE,
		MAXIMUM_IMAGE_SIZE_MB
	} from '$lib/images/imageConstants';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import type { UploadedImage } from '$lib/interfaces/uploads';
	import { uploadPost } from '$lib/stores/uploadStores';
	import ImagePreviewModal from './ImagePreviewModal.svelte';

	let imageResults: UploadedImage[] = [];

	const resetImages = () => {
		const imageInput = document.querySelector('#postImages') as HTMLInputElement;
		if (imageInput) {
			imageInput.value = '';
		}

		imageResults = [];
	};

	const updatePostState = () => {
		const postData = { ...$uploadPost };
		postData.files = imageResults.map((result) => result.imageFile);
		postData.imageMetadata = imageResults;
		uploadPost.set(postData);
	};

	const onPostImagesUpload = async (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		const files = target.files ? Array.from(target.files) : [];

		if (files.length > MAXIMUM_NUMBER_OF_IMAGES_FREE) {
			resetImages();
			return;
		}

		const imageValidationPromises: Promise<UploadedImage | boolean>[] = files.map((file) =>
			getImageData(file)
		);
		const validationResults = await Promise.all(imageValidationPromises);

		const acceptableResults: UploadedImage[] = [];

		validationResults.forEach((result) => {
			if (typeof result !== 'boolean') {
				acceptableResults.push(result);
			}
		});

		if (acceptableResults.length !== validationResults.length) {
			resetImages();
			return;
		}

		imageResults = acceptableResults;
		updatePostState();
	};

	const deleteUploadedImage = (event: FormEventHandler<HTMLElement>) => {
		let target = event.target as HTMLElement;

		if (target.nodeName === 'I') {
			if (target.parentElement) {
				target = target.parentElement;
			}
		}

		const fileID = target.dataset.fileId;

		imageResults = imageResults.filter((result) => result.fileID !== fileID);

		updatePostState();
	};
</script>

<div class="mt-5 flex items-center justify-center w-full">
	<label
		for="postImages"
		class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
	>
		<div class="flex flex-col items-center justify-center pt-5 pb-6">
			<svg
				aria-hidden="true"
				class="w-10 h-10 mb-3 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
				/></svg
			>
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
				<span class="font-semibold">Click to upload</span> or drag and drop
			</p>
			<p class="ml-2 mr-2 text-xs text-gray-500 dark:text-gray-400">
				Accepted Formats: {ACCEPTED_IMAGE_FORMATS.replaceAll('image/', '')}
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">
				(MAX. {MAXIMUM_IMAGE_WIDTH}px by {MAXIMUM_IMAGE_HEIGHT}px)
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">
				(MAX UPLOAD SIZE: {MAXIMUM_IMAGE_SIZE_MB} MB)
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">
				(MAX IMAGES PER POST: {MAXIMUM_NUMBER_OF_IMAGES_FREE} images)
			</p>
		</div>
		<input
			on:change={onPostImagesUpload}
			id="postImages"
			name="postImages"
			type="file"
			class="hidden"
			accept={ACCEPTED_IMAGE_FORMATS}
			multiple
		/>
	</label>
</div>

<div class="flex justify-center mt-5 flex-wrap space-x-2">
	{#each $uploadPost.imageMetadata as imageResult}
		<div>
			<img class="w-32 h-32 object-cover" src={imageResult.encoding?.toString()} alt="" />
			<div class="flex mt-1">
				<button
					on:click={deleteUploadedImage}
					data-file-id={imageResult.fileID}
					type="button"
					class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
				>
					<i class="fa-solid fa-trash" />
				</button>
				<ImagePreviewModal
					modalID={`modal-${imageResult.fileID}`}
					imageEncoding={imageResult.encoding?.toString()}
					fileName={imageResult.imageFile.name}
				/>
			</div>
		</div>
	{/each}
</div>
