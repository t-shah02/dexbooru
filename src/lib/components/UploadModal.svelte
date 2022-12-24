<script lang="ts">
	import { getImageEncoding, shortenFileName } from '$lib/images/parsing';
	import Button from '@smui/button';

	interface UploadedImage {
		blob: File;
		encoding: string | ArrayBuffer | null;
		fileName: string;
	}

	interface FormEventHandler<T> {
		target: EventTarget | null;
	}

	// state variables for the context of sending posting image data to the server and loading from the user's file system
	let failedUploads: UploadedImage[] = [];
	let fullyUploaded = 0;
	let uploadingToServer = false;
	let uploadedImages: UploadedImage[] = [];

	const resetUploadingStates = () => {
		failedUploads = [];
		fullyUploaded = 0;
		uploadingToServer = false;
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

			<div class="file has-name is-boxed">
				<label class="file-label">
					<input
						on:change={handleFileSelection}
						class="file-input"
						multiple
						accept="image/*"
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
					<div class="uploaded-image-ctn">
						<img alt={fileName} class="uploaded-image" src={encoding?.toString()} />
						<h2 class="uploaded-image-name">{fileName}</h2>
					</div>
				{/each}
			</div>

			{#if uploadedImages.length}
				
				<Button
					on:click={uploadImages}
					variant="unelevated"
					style="display : block; margin-left : auto; margin-right : auto; background-color : blue; color : white"
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
		width: 50%;
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 15px;
	}

	.title {
		margin: 15px;
		text-align: center;
	}

	.image-grid {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 75%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.uploaded-image-ctn {
		margin: 10px;
	}

	.uploaded-image-name {
		text-align: center;
		color: gray;
	}

	.uploaded-image {
		width: 200px;
		height: 200px;
		object-fit: cover;
		transition: scale 200ms ease-in-out;
	}

	.uploaded-image:hover {
		cursor: pointer;
		scale: 1.01;
	}
</style>
