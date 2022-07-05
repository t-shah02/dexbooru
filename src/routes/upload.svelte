<script context="module">
	export async function load({ fetch, session }) {
		const auth = session.authenticated;
		const response = await fetch('/api/tags');
		const tagsData = await response.json();
		const tags = tagsData.map((tagData) => tagData.name);

		const responseTwo = await fetch("/api/artists");
		const artistsData = await responseTwo.json();
		const artists = artistsData.artists;

		if (auth) {
			const username = session.username;
			return { props: { username: username, tags: tags, artists: artists} };
		}
		return { status: 302, redirect: '/' };
	}
</script>

<script>
	import { slide,fade } from 'svelte/transition';
	import { files } from '../stores';
	import { darkmode } from '../stores';
	import { darkBodyColor, darkCardColor, lightModeColor } from '../colors.js';
	import TagsArtistSearchbar from "../components/TagsArtistSearchbar.svelte";
	import { getImageEncoding } from '../util/files';
	import { onMount } from 'svelte';
	import {v4 as uuid } from "uuid";


	export let username;
	export let tags;
	export let artists;
	export let showTags2;

	let isFileTooLongError = false;
	let filesData = [];
	let modalActive = false;
	let activeFileName = "";
	let activeFileWidth;
	let activeFileHeight;
	let activeFileEncoding = "";

	//tags variables
	let isQueryEmpty = false;
	let isQueryTooLong = false;
	let isTagsTooLong = false;
	let doesTagExist = false;
	let isArtistEmpty = false;
	let isArtistTooLong = false;

	const loadUploadedImages = async () => {
		for (const file of $files) {
			const fileInfo = {
				name : file.name,
				encoding : await getImageEncoding(file),
				imageID : uuid(),
				file
			}
			filesData = filesData.concat([fileInfo]);
		}
	};

	onMount(loadUploadedImages);

	const clearFilesInDOM = () => {
		const fileInput = document.querySelector('#many');
		fileInput.value = '';
		files.set([]);
		filesData = [];
	};

	async function processFiles() {
		
		const fileInput = document.querySelector('#many');
		files.set(Array.from(fileInput.files));

		if ($files.length > 10) {
			isFileTooLongError = true;
			clearFilesInDOM();
			
		} else {
			isFileTooLongError = false;
			filesData = [];	
			await loadUploadedImages();
		}

		fileInput.value = "";
	}

	function displayModal(e) {
		let target = e.target.nodeName === "I" ? e.target.parentNode : e.target;

		activeFileEncoding = target.dataset.encoding;
		activeFileName = target.dataset.fileName;
		
		let img = new Image();
		img.src = activeFileEncoding;

		img.onload = () => {
			activeFileWidth = img.width;
			activeFileHeight = img.height;
		}
		

		modalActive = true;
	}

	function closeModal() {
		activeFileEncoding = "";
		activeFileName = "";
		modalActive = false;
	}

	function removeAllImages() {
		const fileInput = document.querySelector('#many');
		fileInput.value = "";
		files.set([]);
		filesData = [];
	}

	function removeImage(e) {
		let target = e.target.nodeName === "I" ? e.target.parentNode : e.target;
		let imageID = target.dataset.imageId;
		
		let filteredFilesData = filesData.filter((fileObj) => fileObj.imageID !== imageID);
		files.set(filteredFilesData.map((fileObj) => fileObj.file));
		filesData = filteredFilesData;
	}

	//errors
	function clearErrors() {
		isQueryEmpty = false;
		isQueryTooLong = false;
		isTagsTooLong = false;
		isArtistEmpty = false;
		isArtistTooLong = false;
		doesTagExist = false;
	}

</script>

<svelte:head>
	<title>Upload - Dexbooru</title>
</svelte:head>

<div id="upload" style="background-color : {$darkmode ? darkBodyColor : lightModeColor}">
	<div in:slide out:slide>
		{#if isFileTooLongError}
			<div class="notification is-danger">
				<button
					class="delete"
					on:click={() => {
						files.set([]);
						isFileTooLongError = false;
					}}
				/>
				<h1 class="upload-limit-msg">Please limit uploads to 10 images.</h1>
			</div>
		{/if}

		<div
			style="background-color : {$darkmode ? darkCardColor : lightModeColor}"
			class="upload-card"
		>
			<label style="color : {$darkmode ? 'white' : 'black'}" for="file is-primary"
				>Upload images:</label
			>
			<div class="file is-primary">
				<label class="file-label">
					<input
						class="file-input"
						type="file"
						name="image"
						accept="image/*"
						on:change={processFiles}
						id="many"
						multiple
					/>
					<span class="file-cta">
						<span class="file-icon">
							<i class="fas fa-upload" />
						</span>
						<span class="file-label"> Choose up to 10 images </span>
					</span>
				</label>
			</div>
		</div>
	
		<div class="upload-info">
			<h1 style="color : {$darkmode ? 'white' : 'black'}; text-align : center">Images selected ({filesData.length})</h1>
			<button on:click={removeAllImages} class="button is-normal is-danger is-responsive"><span>CLEAR ALL</span></button>
		</div>
		<div in:slide out:slide class="image-collage">
			{#each filesData as fileData}
				<div data-file-name={fileData.name} class="collage-img" style="background-image : url('{fileData.encoding}')">
					<h1 class="file-name" style="font-size : 12px;">{fileData.name}</h1>
					<div class="image-controls">
						<button on:click={removeImage} data-image-id={fileData.imageID} data-tooltip="Remove image" class="button is-danger has-tooltip-right">
							<i class="control-item fa-solid fa-trash"></i>
						</button>
						<br>
						<button data-file-name={fileData.name} data-encoding={fileData.encoding} on:click={displayModal} data-tooltip="Preview image" class="button is-primary has-tooltip-right">
							<i class="control-item fa-solid fa-eye"></i>
						</button>
					</div>
				</div>
			{/each}
		</div>

		{#if modalActive}
			<div class="modal">
				<div on:click={closeModal} class="modal-background" />
					<div style="background-image : url('{activeFileEncoding}'); width : {activeFileWidth}px; height : {activeFileHeight}px" class="modal-content">
					</div>
				<button class="modal-close is-large" aria-label="close" on:click={closeModal} />
			</div>
		{/if}

		<TagsArtistSearchbar tags={tags} artists={artists}/>
		<!-- {#if showTags2}
			<div in:slide out:slide class="block">
				{#if addedArtist != ''}
					<span in:slide out:fade class="tag is-black"
						>Artist: {addedArtist}<button class="delete" on:click={clearArtist} /></span>
						{/if}
							{#each Array.from(addedTags) as tag}
								<span
								in:slide
								out:fade
								class="tag {colors[Math.floor(Math.random() * colors.length)]}"
								>{tag}<button class="delete" on:click={() => deleteTag(tag)} /></span
								>
							{/each}
						</div>
					{/if} -->

		{#if filesData.length}
			<div class="upload-btn-container">
				<button class="upload-btn button is-primary">UPLOAD</button>
			</div>
		{/if}
	</div>
</div>	



<style>
	#upload {
		min-height: 100vh;
		padding-top: 25px;
		padding-bottom: 8px;
		transition: background-color 200ms ease-in-out;
	}
	

	.upload-btn-container .upload-btn {
		display : block;
		margin-left : auto;
		margin-right : auto;
		margin-bottom : 45px;
	}	

	.upload-info .button {
		display : block;
		margin-left: auto;
		margin-right : auto;
		
	}
	
	
	/* width */
	::-webkit-scrollbar {
		width: 1px;
	}

	.modal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-position : top center;
		background-size : cover;
		background-repeat : no-repeat;
	}

	.modal-background {
		background-color: rgba(8, 8, 8, 0.8);
	}
/* 
	.modal img {
		margin-top: 5px;
		margin-bottom: 5px;

	} */

	.image-collage {
		display: flex;
		flex-wrap : wrap;
		justify-content : center;
		margin-top: 55px;
		margin-bottom: 35px;
	}

	.modal-close {
		position: absolute;
		right: 0;
		top: 60px;
	}

	.collage-img {
		width: 300px;
		height: 300px;
		position : relative;
		background-repeat: no-repeat;
		background-position: top;
		background-size: cover;
		margin: 10px;
		border-radius : 10px;
	}
	
	.collage-img:hover .file-name {
		display : block;
		border : none;
		border-radius: 0px;
		border-bottom-right-radius: 10px;
		color : white;
		background-color : rgba(0, 0, 0, 0.35);
		text-align: center;
	}

	.collage-img:hover .image-controls {
		display : block;
		position : absolute;
		top : 50%;
		left : 55%;
		transform: translate(-50%, -50%);
	}

	.button {
		margin : 5px;
		width : 10%;
	}
	

	.image-controls {
		display : none;
	}

	
	

	.upload-limit-msg {
		font-size: 15px;
		color: white;
		margin-top: 1px;
	}

	div {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}

	.file-name {
		display : none;
		position : absolute;
		bottom : 0;
		right : 0;
		
		
	}
	

	label {
		font-size: 30px;
	}

	.file-label {
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 8px;
		padding-bottom: 8px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
		margin-bottom: 10px;
		align-self: center;
		overflow: visible;
		background: transparent;
	}

	.file-cta {
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 8px;
		padding-bottom: 8px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 10px;
		align-self: center;
		overflow: visible;
		background: gray;
	}

	.file-label {
		font-size: 100%;
	}

	.upload-card {
		display: block;
		text-align: center;
		width: 70%;
		min-width: 300px;
		max-width: 500px;
		border-radius: 10px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 30px;
		transition: all 200ms ease-in-out;
		margin-top: 100px;
	}

	.upload-card:hover {
		transform: scale(1.01);
	}

	input {
		background-color: transparent;
		border: 0px;
	}

	.notification {
		position: absolute;
		top: 55px;
		height: 40px;
		width: 100%;
	}

	.upload-limit-msg {
		position: absolute;
		top: 10px;
		font-size: 15px;
	}
</style>
