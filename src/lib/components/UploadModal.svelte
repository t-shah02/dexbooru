<script lang="ts">
	import ImagePreviewModal from './ImagePreviewModal.svelte';
	import {
		getFileSizeInMB,
		getImageEncoding,
		shortenFileName,
		getImageDimensions
	} from '$lib/images/parsing';
	import {
		ACCEPTED_IMAGE_FORMATS,
		MAXIMUM_NUMBER_OF_IMAGES_FREE,
		MAXIMUM_IMAGE_HEIGHT,
		MAXIMUM_IMAGE_WIDTH,
		MAXIMUM_IMAGE_SIZE_MB,
		MAXIMUM_IMAGE_AREA
	} from '$lib/images/imageConstants';
	import type { UploadedImage } from '$lib/interfaces/uploads';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { fade, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	// state variables for the context of sending posting image data to the server and loading from the user's file system
	let totalInvalidFiles = 0;
	let tooManyImages = false;
	let fullyUploadedToServer = 0;
	let uploadingToServer = false;
	let uploadedImages: (UploadedImage | boolean)[] = [];

	// state variables for the post metadata
	let artist = '';
	let tag = '';
	let artists: string[] = [];
	let tags: string[] = [];
	let isNSFW: boolean = false;

	const addTagOnKeypress = (event: KeyboardEvent) => {
		const key = event.key;
		if (key === 'Enter') {
			addTag();
		}
	};

	const addArtistOnKeypress = (event: KeyboardEvent) => {
		const key = event.key;
		if (key === 'Enter') {
			addArtist();
		}
	};

	const addTag = () => {
		if (!tag) return;

		const tagSet = new Set(tags);
		tagSet.add(tag.toLocaleLowerCase());
		tags = Array.from(tagSet);
	};

	const addArtist = () => {
		if (!artist) return;

		const artistSet = new Set(artists);
		artistSet.add(artist.toLocaleLowerCase());
		artists = Array.from(artistSet);
	};

	const removeTag = (event: PointerEvent) => {
		const target = event.target as HTMLDivElement;
		const tagSpan = target.firstChild;
		if (tagSpan) {
			const targetTag = tagSpan.textContent;
			const filteredTags = tags.filter((tag) => tag !== targetTag);
			tags = filteredTags;
		}
	};

	const removeArtist = (event: PointerEvent) => {
		const target = event.target as HTMLDivElement;
		const artistSpan = target.firstChild;
		if (artistSpan) {
			const targetArtist = artistSpan.textContent;
			const filteredArtists = artists.filter((artist) => artist !== targetArtist);
			artists = filteredArtists;
		}
	};

	const resetUploadingStates = () => {
		uploadedImages = [];
		fullyUploadedToServer = 0;
		totalInvalidFiles = 0;
		tooManyImages = false;
		uploadingToServer = false;
	};

	const handleFileSelection = async (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;

		const rawFiles = target.files ? Array.from(target.files) : null;

		if (rawFiles) {
			if (rawFiles.length > MAXIMUM_NUMBER_OF_IMAGES_FREE) {
				tooManyImages = true;
				setTimeout(() => {
					resetUploadingStates();
					target.value = '';
				}, 3500);
				return;
			}

			const uploadedImageData = await Promise.all(
				rawFiles.map(async (file: File) => {
					const sizeInMB = getFileSizeInMB(file);

					if (sizeInMB > MAXIMUM_IMAGE_SIZE_MB) {
						return false;
					}
					const encoding = await getImageEncoding(file);
					const [width, height] = getImageDimensions(encoding);
					const imageArea = width * height;

					if (imageArea > MAXIMUM_IMAGE_AREA) {
						return false;
					}
					return { sizeInMB, fileName: file.name, encoding, width, height };
				})
			);

			const validUploadedImageData = uploadedImageData.filter((data) => data !== false);
			uploadedImages = validUploadedImageData;
			totalInvalidFiles = uploadedImageData.length - validUploadedImageData.length;
		}
	};
</script>

<div id="upload-modal" class="modal active">
	<div class="row">
		<button data-ui="#upload-modal" class="transparent circle">
			<i>close</i>
		</button>
		<h5>Upload a post</h5>
	</div>
	<h6 class="image-specs">
		Maximum image file size: {MAXIMUM_IMAGE_SIZE_MB} MB
	</h6>
	<h6 class="image-specs">
		Maximum image dimensions: {MAXIMUM_IMAGE_WIDTH}px by {MAXIMUM_IMAGE_HEIGHT}px
	</h6>

	<div class="upload-section row">
		<div class="field label prefix border">
			<i>attach_file</i>
			<input type="text" />
			<input
				on:change={handleFileSelection}
				name="selectedFiles"
				type="file"
				multiple
				accept={ACCEPTED_IMAGE_FORMATS}
			/>
			<label for="selectedFiles">Choose your images</label>
		</div>

		{#if uploadedImages.length}
			<div class="row scroll" id="row-scroll">
				{#each Object.entries(uploadedImages) as [index, uploadedImage]}
					{#if typeof uploadedImage !== 'boolean'}
						<img
							in:fade
							out:fade
							class="uploaded-image"
							src={uploadedImage.encoding?.toString()}
							alt="preview for {uploadedImage.fileName}"
							title={uploadedImage.fileName}
							data-ui="#modal-{index}"
						/>

						<ImagePreviewModal
							fileName={uploadedImage.fileName}
							modalID={`modal-${index}`}
							imageEncoding={uploadedImage.encoding?.toString()}
						/>
					{/if}
				{/each}
			</div>
		{/if}

		{#if totalInvalidFiles}
			<h6 in:slide out:slide>Unable to upload {totalInvalidFiles} image(s)</h6>
		{/if}
		{#if tooManyImages}
			<h6 in:slide out:slide>
				A post can contain a maximum of {MAXIMUM_NUMBER_OF_IMAGES_FREE} images
			</h6>
		{/if}
	</div>

	<div class="text-field field label border" id="inputTags">
		<input on:keydown={addTagOnKeypress} bind:value={tag} type="text" />
		<label>Enter a tag name</label>
		<button on:click={addTag} class="add-btn">Add tag</button>
	</div>

	<div class="chip-row">
		{#each tags as tag (tag)}
			<div
				in:slide
				out:slide|local
				animate:flip={{ duration: 500 }}
				on:click={removeTag}
				class="chip border"
			>
				<span>{tag}</span>
				<i class="small">close</i>
			</div>
		{/each}
	</div>

	<div class="text-field field label border">
		<input on:keydown={addArtistOnKeypress} bind:value={artist} type="text" />
		<label>Enter an artist name</label>
		<button on:click={addArtist} class="add-btn">Add artist</button>
	</div>

	<div class="chip-row">
		{#each artists as artist (artist)}
			<div
				in:slide
				out:slide|local
				animate:flip={{ duration: 500 }}
				on:click={removeArtist}
				class="chip border"
			>
				<span>{artist}</span>
				<i class="small">close</i>
			</div>
		{/each}
	</div>

	<label class="checkbox">
		<input type="checkbox" bind:checked={isNSFW} />
		<span>Mark post as NSFW</span>
	</label>

	<br />
	<div class="uploadButtonCtn">
		<button class="uploadButton">
			<i>cloud_upload</i>
			<span>Post</span>
		</button>
	</div>
</div>

<style>
	.modal {
		width: 80%;
	}

	.add-btn {
		margin: 0;
		margin-top: 15px;
	}

	.text-field {
		margin-top: 50px;
	}

	.image-specs {
		font-size: 15px;
		color: gray;
	}

	.upload-section {
		flex-wrap: wrap;
		display: flex;
		flex-direction: column;
	}

	.chip {
		margin: 5px;
	}

	.chip-row {
		width: 100%;
		margin-top: 70px;
		margin-bottom: 5px;
		overflow-y: clip;
	}

	#row-scroll {
		overflow-x: scroll;
		overflow-y: clip;
		width: 80%;
		height: 100px;
	}

	#inputTags {
		margin-bottom: 20px;
	}

	.uploaded-image {
		width: 100px;
		height: 100px;
		object-fit: contain;
		transition: all 200ms ease-in-out;
	}

	.uploaded-image:hover {
		cursor: pointer;
		scale: 1.05;
	}

	.row {
		margin: 0;
		padding: 0;
	}

	.uploadButtonCtn {
		margin-top:15px;
		display:flex;
		justify-content:center;
	}
</style>
