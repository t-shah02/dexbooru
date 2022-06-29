<script context="module">
	export async function load({ fetch, session }) {
		const auth = session.authenticated;
		const response = await fetch("/api/tags");
		const tagsData = await response.json();
		const tags = tagsData.map((tagData) => tagData.name);

		if (auth) {
			const username = session.username;
			return { props: { username: username, tags : tags } };
		}
		return { status: 302, redirect: '/' };
	}
</script>

<script>
	import { slide } from 'svelte/transition';
	import UploadImage from '../components/UploadImage.svelte';
	import { files } from "../stores";
	import { darkmode } from "../stores";
	import { darkNavbarColor, darkBodyColor, lightModeColor} from "../colors.js";

	export let username;
	export let tags;
	
	let isFileTooLongError = false;
	//$: file = files[0];


	const clearFilesInDOM = () => {
		const fileInput = document.querySelector("#many");
		fileInput.value = "";
		files.set([]);
	}

	function checkImageLength() {
		const fileInput = document.querySelector("#many");
		files.set(fileInput.files);
		console.log($files);
		if ($files.length > 10) {
			isFileTooLongError = true;
			files.set([]);
			clearFilesInDOM();
		} else {
			isFileTooLongError = false;
		}
	}

	function deleteImages() {
		files.set([]);
		clearFilesInDOM();
	}

</script>

<svelte:head>
	<title>Upload - Dexbooru</title>
</svelte:head>
<div id="upload" style="background-color : {$darkmode ? darkBodyColor : lightModeColor}">
<div in:slide out:slide>
	{#if isFileTooLongError}
		<div class="notification is-danger">
			<button class="delete" on:click={() => {files.set([]); isFileTooLongError = false;}} />
			<h1 class="upload-limit-msg">Please limit uploads to 10 images.</h1>
		</div>
	{/if}

	{#if $files.length == 0}
	<div class="upload-card">
		<label for="file is-primary">Upload images:</label>
		<div class="file is-primary">
			<label class="file-label">
				<input
					class="file-input"
					type="file"
					name="image"
					accept="image/*"
					on:change={checkImageLength}
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
	{/if}

	<div class="files">
		<h2>IMAGE PREVIEW</h2>
		<div class="imagebar">
			{#each Array.from($files) as file}
				<UploadImage tags={tags} username={username} file={file} />
			{/each}
		</div>
		{#if $files.length > 0}
			<div class="g">
				<button type="submit" on:click={deleteImages} class="button is-white" id="g"
					>DELETE ALL</button
				>
			</div>
		{/if}
	</div>
</div>
</div>
<style>

	#upload {
		min-height : 100vh;
		padding-top: 25px;
		padding-bottom: 8px;
	}
	/* width */
	::-webkit-scrollbar {
		width: 1px;
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

	h2 {
		left: 0;
		right: 0;
		padding-top: 15px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 20px;
		margin-bottom: 10px;
		text-align: center;
	}

	.imagebar {
		display: flex;
		overflow-x: auto;
		margin-bottom: 50px;
		margin-left: 2.5%;
		margin-right: 2.5%;
		scrollbar-width: thin;
	}

	@media only screen and (max-width: 600px) {
		.imagebar {
			display: flex;
			flex-direction: column;
			align-content: center;
		}
	}

	.image {
		background-color: rgba(246, 72, 147, 0.58);
		border-radius: 8px;
		padding: 10px;
		font-size: 30px;
		text-align: center;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-left: 5px;
		margin-right: 5px;
		min-width: 300px;
		max-width: 300px;
		height: 500px;
	}

	.upload-card {
		display: block;
		text-align: center;
		background-color: #d0d0d0;
		width: 400px;
		border-radius: 10px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 30px;
		transition: all 200ms ease-in-out;
		background-color: #734ae8;
		background-image: linear-gradient(315deg, #734ae8 0%, #89d4cf 74%);
		margin-top: 100px;
	}

	.files {
		margin-top: 50px;
	}

	.upload-card:hover {
		transform: scale(1.01);
	}

	input {
		background-color: transparent;
		border: 0px;
	}

	.arrow {
		position: relative;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		align-self: center;
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

	.g {
		margin-bottom : 40px;
		display: flex;
		justify-content: center;
		align-self: center;
	}
</style>
