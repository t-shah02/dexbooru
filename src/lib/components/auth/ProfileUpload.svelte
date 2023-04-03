<script lang="ts">
	import {
		ACCEPTED_IMAGE_FORMATS,
		MAXIMUM_IMAGE_WIDTH,
		MAXIMUM_IMAGE_HEIGHT,
		MAXIMUM_IMAGE_SIZE_MB
	} from '$lib/images/imageConstants';
	import { getImageData } from '$lib/images/imageClient';
	import type { FormEventHandler } from '$lib/interfaces/inputs';

	export let onSettingsPage = false;

	let profilePictureEncoding = '';
	let profileImageFileName = '';

	const onProfilePictureChange = async (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		const file: File | null = target.files ? target.files[0] : null;

		if (file) {
			const imageData = await getImageData(file);

			if (typeof imageData === 'boolean') {
				cancelProfilePicture();
				return;
			}

			profilePictureEncoding = imageData.encoding as string;
			profileImageFileName = imageData.imageFile.name;
		}
	};

	const cancelProfilePicture = () => {
		profilePictureEncoding = '';
		profileImageFileName = '';

		const profilePictureInput = document.querySelector('#profilePicture') as HTMLInputElement;

		if (profilePictureInput) {
			profilePictureInput.value = '';
		}
	};
</script>

<div class="flex items-center justify-center w-full">
	<label
		for="profilePicture"
		class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
	>
		<div class="flex flex-col items-center justify-center pt-5 pb-6">
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
		</div>
	</label>
	<input
		id="profilePicture"
		name="profilePicture"
		accept={ACCEPTED_IMAGE_FORMATS}
		type="file"
		class="hidden"
		on:change={onProfilePictureChange}
		required={onSettingsPage}
	/>
</div>

{#if profilePictureEncoding.length}
	<div class="flex flex-col">
		<figure class="max-w-lg">
			<img
				class="rounded-full w-32 h-32 m-auto"
				src={profilePictureEncoding}
				alt={profileImageFileName}
			/>
			<figcaption class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
				{profileImageFileName}
			</figcaption>
		</figure>
		<button
			on:click={cancelProfilePicture}
			type="button"
			class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 ml-auto mr-auto dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
			>Cancel</button
		>
	</div>
{/if}
