<script lang="ts">
	import {
		ACCEPTED_IMAGE_FORMATS,
		MAXIMUM_IMAGE_WIDTH,
		MAXIMUM_IMAGE_HEIGHT
	} from '$lib/images/imageConstants';
	import { validateImage } from '$lib/images/imageClient';
	import type { FormEventHandler } from '$lib/interfaces/inputs';

	let profilePictureEncoding = '';
	let profileImageFileName = '';

	const onProfilePictureChange = async (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		const file: File | null = target.files ? target.files[0] : null;

		if (file) {
			const imageData = await validateImage(file);

			if (typeof imageData === 'boolean') {
				return;
			}

			profilePictureEncoding = imageData.encoding as string;
			profileImageFileName = imageData.fileName;
		}
	};

	const cancelProfilePicture = () => {
		profilePictureEncoding = '';
		profileImageFileName = '';
	};
</script>

{#if !profilePictureEncoding.length}
	<div class="flex items-center justify-center w-full">
		<label
			for="profilePicture"
			class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
		>
			<div class="flex flex-col items-center justify-center pt-5 pb-6">
				<p class="mb-2 ml-2 mr-2 text-sm text-gray-500 dark:text-gray-400 text-center">
					<span class="font-semibold">Click to upload a profile picture or drag and drop it</span>
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400 text-center">
					{ACCEPTED_IMAGE_FORMATS}
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					(MAX. {MAXIMUM_IMAGE_WIDTH}px by {MAXIMUM_IMAGE_HEIGHT}px)
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
		/>
	</div>
{:else}
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
