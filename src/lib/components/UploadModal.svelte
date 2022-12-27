<script lang="ts">
	import { getImageEncoding, shortenFileName } from '$lib/images/parsing';
	import { ACCEPTED_IMAGE_FORMATS } from '$lib/images/imageConstants';
	import Button from '@smui/button';
	import type { SauceSuggestion, UploadedImage } from '$lib/interfaces/uploads';
	import type { FormEventHandler } from '$lib/interfaces/inputs';

	// state variables for the context of sending posting image data to the server and loading from the user's file system
	let failedUploads: UploadedImage[] = [];
	let fullyUploaded = 0;
	let uploadingToServer = false;
	let uploadedImages: UploadedImage[] = [];

	// state variable for saucenao suggestions
	let sauceSuggestions: SauceSuggestion[] = [];

	const resetUploadingStates = () => {
		failedUploads = [];
		fullyUploaded = 0;
		uploadingToServer = false;
		sauceSuggestions = [];
	};

	const handleFileSelection = async (event: FormEventHandler<HTMLInputElement>) => {
		resetUploadingStates();

		const target = event.target as HTMLInputElement;
		const rawFiles = target.files ? Array.from(target.files) : null;

		if (rawFiles) {
			uploadedImages = await Promise.all(
				rawFiles.map(async (file: File) => {
					const encoding = await getImageEncoding(file);
					return { blob: file, fileName: shortenFileName(file.name), encoding };
				})
			);

			// for (const image of uploadedImages) {
			// 	const { encoding, blob } = image;
			// 	const format = blob.type;
			// 	const sauceResponse = await fetch('/api/sauce', {
			// 		method: 'POST',
			// 		body: JSON.stringify({ encoding, format })
			// 	});
			// 	const resultsData: SauceSuggestion[] = await sauceResponse.json();
			// 	sauceSuggestions = [...sauceSuggestions, ...resultsData];
			// 	console.log(sauceSuggestions);
			// }
		}
	};

	const uploadImage = async (uploadedImage: UploadedImage) => {
		const encoding = uploadedImage.encoding;

		const response = await fetch('/auth/upload', {
			method: 'POST',
			body: JSON.stringify({ encoding })
		});

		return response.ok;
	};

	const uploadImages = async () => {
		for (const image of uploadedImages) {
			const status = await uploadImage(image);
			if (!status) {
				failedUploads = [...failedUploads, image];
			} else {
				fullyUploaded++;
			}
		}
	};
</script>

<div class="hystmodal" id="upload-modal" aria-hidden="true">
	<div class="hystmodal__wrap">
		<div class="hystmodal__window" role="dialog" aria-modal="true">
			<button data-hystclose class="hystmodal__close">Закрыть</button>
			<h1 class="title">Upload to Dexbooru</h1>

			<div class="full-container">
				<div class="left-container">
					<div class="file has-name is-boxed">
						<label class="file-label">
							<input
								on:change={handleFileSelection}
								class="file-input"
								multiple
								accept={ACCEPTED_IMAGE_FORMATS}
								type="file"
							/>
							<span class="file-cta">
								<span class="file-icon">
									<i class="fas fa-upload" />
								</span>
								<span class="file-label">
									{uploadedImages.length
										? `${uploadedImages.length} file(s) selected`
										: 'Choose your images!'}
								</span>
							</span>
						</label>
					</div>

					<div class="image-grid">
						{#each uploadedImages as { encoding, fileName }}
							<img alt={fileName} class="uploaded-image" src={encoding?.toString()} />
						{/each}
					</div>
				</div>
				<div class="right-container">
					<h1>lol</h1>
				</div>
			</div>

			{#if uploadedImages.length}
				<Button
					on:click={uploadImages}
					variant="unelevated"
					style="display : block; margin-left : auto; margin-right : auto; background-color : blue; color : white; margin-top : 100px;"
				>
					Share your post
				</Button>

				<h2 style="text-align : center">Number uploaded: {fullyUploaded}</h2>
			{/if}
		</div>
	</div>
</div>

<style>
	.file {
		width: 45%;
		display: block;
		margin-left: 25px;
		margin-bottom: 15px;
	}

	.full-container {
		display: flex;
		width: 100%;
	}

	.left-container {
		width: 75%;
		display: flex;
		flex-direction: column;
	}

	.title {
		margin: 15px;
		text-align: center;
	}

	.image-grid {
		display: block;
		display: flex;
		flex-wrap: wrap;
		margin-left: 25px;
	}

	.uploaded-image {
		margin: 10px;
		width: 100px;
		height: 100px;
		object-fit: cover;
		transition: scale 200ms ease-in-out;
	}

	.uploaded-image:hover {
		cursor: pointer;
		scale: 1.01;
	}
</style>
