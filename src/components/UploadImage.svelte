<script>
	import { fade, slide } from 'svelte/transition';
	import { files } from "../stores";
	import {onDestroy} from 'svelte';


	

	// exports
	export let file;
	export let username;
	export let tags;

	// state variables
	let triggerModal = false;
	let fileTooLarge = false;
	let isQueryEmpty = false;
	let isQueryTooLong = false;
	let isTagsTooLong = false;
	let doesTagExist = false;
	let isArtistEmpty = false;
	let isArtistTooLong = false;
	let showTags = false;
	let showTags2 = false;
	let artist = '';
	let isNSFW;
	let addedArtist = '';
	let beingUploaded = false;
	let finishedUploading = false;

	// constants
	const UPLOAD_LIMIT_MB = 3;
	const RESULT_LIMIT = 6;
	let colors = ['is-success', 'is-link', 'is-warning', 'is-danger', 'is-primary'];

	//other variables
	let addedTags = new Set();
	let selectedTags = new Set();
	let matches = [];
	let query = '';

	//errors
	function clearErrors() {
		isQueryEmpty = false;
		isQueryTooLong = false;
		isTagsTooLong = false;
		isArtistEmpty = false;
		isArtistTooLong = false;
		doesTagExist = false;
	}

	//utility functions
	const toggleModal = () => (triggerModal = !triggerModal);

	function addToString(string) {
		query = string;
	}


	function removeUploadedImage() {
		const fileArray = Array.from($files);
		const filtered = fileArray.filter((f) => f !== file);
		files.set(filtered);
	}

	function dispTagOnClick(e) {
		const clickedElement = e.target;
		const elementType = clickedElement.nodeName;
		let angleIcon;
		if (elementType == 'H1' || elementType == 'I') {
			const parentNode = clickedElement.parentNode;
			angleIcon = parentNode.querySelector('#angle-arrow');
		} else {
			angleIcon = clickedElement.querySelector('#angle-arrow');
		}

		if (showTags) {
			angleIcon.className = 'fa-solid fa-angle-down';
		} else {
			angleIcon.className = 'fa-solid fa-angle-up';
		}

		angleIcon.style.paddingLeft = '5px';
		angleIcon.style.paddingRight = '5px';
		angleIcon.style.transform = 'translateY(25%)';
		showTags = !showTags;
	}

	function dispTagOnClick2(e) {
		const clickedElement = e.target;
		const elementType = clickedElement.nodeName;
		let angleIcon;
		if (elementType == 'H1' || elementType == 'I') {
			const parentNode = clickedElement.parentNode;
			angleIcon = parentNode.querySelector('#angle-arrow');
		} else {
			angleIcon = clickedElement.querySelector('#angle-arrow');
		}

		if (showTags2) {
			angleIcon.className = 'fa-solid fa-angle-down';
		} else {
			angleIcon.className = 'fa-solid fa-angle-up';
		}

		angleIcon.style.paddingLeft = '5px';
		angleIcon.style.paddingRight = '5px';
		angleIcon.style.transform = 'translateY(25%)';
		showTags2 = !showTags2;
	}

	//add/remove tags and artists
	function addArtist() {
		if (artist == '') {
			console.log(artist);
			isArtistEmpty = true;
		} else if (artist.length > 30) {
			isArtistTooLong = true;
		} else {
			isArtistEmpty = false;
			isArtistTooLong = false;
			addedArtist = artist;
		}
	}

	function addTag() {
		if (query == '') {
			isQueryEmpty = true;
		} else if (query.length > 30) {
			isQueryTooLong = true;
		} else if (addedTags.size > 10) {
			isTagsTooLong = true;
		} else if (addedTags.has(query)) {
			doesTagExist = true;
		} else {
			isQueryEmpty = false;
			isQueryTooLong = false;
			isTagsTooLong = false;
			doesTagExist = false;
			addedTags.add(query.toLowerCase());
			addedTags = new Set(addedTags);
			query = "";
		}
	}

	function clearArtist() {
		addedArtist = '';
	}

	function deleteTag(tag) {
		addedTags.delete(tag);
		addedTags = new Set(addedTags);
	}

	function clearTag() {
		addedTags = new Set();
	}

	function getTags(e) {
		e.currentTarget.value = query;
		selectedTags = new Set();
		if (query.length) {
			let newMatches = [];
			for (let i = 0; i < tags.length; i++) {
				if (
					tags[i].startsWith(query) &&
					newMatches.length < RESULT_LIMIT
				) {
					newMatches.push(tags[i]);
				}
			}
			matches = newMatches;
		} else {
			matches = [];
		}
	}

	function getB64Encoding() {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
		});
	}

	async function uploadImages() {
		beingUploaded = true;
		const fileSizeMB = file.size / (1024 * 1024);
		if (fileSizeMB > UPLOAD_LIMIT_MB) {
			fileTooLarge = true;
		}

		if (!fileTooLarge) {
			const encoding = await getB64Encoding();

			const body = {
				encoding: encoding,
				tags: Array.from(addedTags),
				artist: addedArtist.toLowerCase(),
				uploader: username,
				nsfw : isNSFW || false
			};

			const headers = {
				'Content-Type': 'application/json'
			};

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: JSON.stringify(body),
				headers
			});

			if (response.ok) {
				finishedUploading = true;
				setTimeout(removeUploadedImage,950);
				
			}
		}
		beingUploaded = false;
	}
</script>

<div class="image" in:slide out:slide>
	{#if fileTooLarge}
		<div class="notification is-danger" in:slide out:slide>
			<button class="delete" on:click={() => (fileTooLarge = false)} />
			<h1 class="upload-limit-msg">Please limit image sizes to a maximum of 3MB.</h1>
		</div>
	{/if}
	<div
		on:click={toggleModal}
		class="pic"
		style="background-image : url({URL.createObjectURL(file)}) width: 90%"
	>
		</div>
		<p class="control">
			<button on:click={removeUploadedImage} class="button is-danger">
			  Cancel upload
			</button>
		  </p>
		{#if finishedUploading}
		  	<h1 style="font-size : 15px; color : green;">Uploaded successfully</h1>
			<i in:slide class="fa-solid fa-circle-check"></i>
		{/if}
	<div class="arrow">
		<div class="tag-show-box" on:click={dispTagOnClick}>
			<i id="angle-arrow" class="fa-solid fa-angle-down" />
		</div>
		{#if showTags}
			<div in:slide out:slide class="block">
				{#if addedTags.size > 0 && beingUploaded == false}
					<div class="g" in:slide out:slide>
						<button type="submit" on:click={uploadImages} class="button is-primary" id="g"
							>UPLOAD</button
						>
					</div>
				{/if}
				<div class="parent">	
					
					<label style="font-size : 17px;" class="checkbox">
						<input bind:checked={isNSFW} type="checkbox">
						Mark post as NSFW (18+)
						<i style="color : red; " class="fa-solid fa-triangle-exclamation"></i>
					</label>

					<div>
						<input
							class="search-bar"
							bind:value={query}
							on:input={getTags}
							placeholder="Search for tags!"
							type="search"
						/>
						<div class="btns">
							{#if matches.length}
								<hr />
							{/if}
							{#each matches as match}
								<button in:slide out:slide on:click={() => addToString(match)}>{match}</button>
								<hr in:slide out:slide />
							{/each}
						</div>
					</div>
				</div>
				<div class="buttons">
					<button on:click={addTag} class="button is-white">ADD TAG</button>
					<button on:click={clearTag} class="button is-white">CLEAR ALL TAGS</button>
				</div>
				<div class="artists">
					<input
						class="search-bar"
						bind:value={artist}
						placeholder="Search for artists!"
						type="search"
					/>
				</div>
				<div class="buttons">
					<button on:click={addArtist} class="button is-white">ADD ARTIST</button>
					<button on:click={clearArtist} class="button is-white">CLEAR ARTIST</button>
				</div>

				{#if isQueryEmpty}
					<div class="notification is-danger" in:slide out:slide>
						<button class="delete" on:click={clearErrors} />
						<h6 class="upload-limit-msg">Tags cannot be empty.</h6>
					</div>
				{/if}
				{#if isQueryTooLong}
					<div class="notification is-danger" in:slide out:slide>
						<button class="delete" on:click={clearErrors} />
						<h6 class="upload-limit-msg">Please limit tags to 30 characters.</h6>
					</div>
				{/if}
				{#if isTagsTooLong}
					<div class="notification is-danger" in:slide out:slide>
						<button class="delete" on:click={clearErrors} />
						<h6 class="upload-limit-msg">You have reached the maximum number of tags allowed.</h6>
					</div>
				{/if}
				{#if isArtistTooLong}
					<div class="notification is-danger" in:slide out:slide>
						<button class="delete" on:click={clearErrors} />
						<h6 class="upload-limit-msg">Please limit artist to 30 characters.</h6>
					</div>
				{/if}
				{#if isArtistEmpty}
					<div class="notification is-danger" in:slide out:slide>
						<button class="delete" on:click={clearErrors} />
						<h6 class="upload-limit-msg">Artist cannot be empty.</h6>
					</div>
				{/if}
				{#if doesTagExist}
					<div class="notification is-danger" in:slide out:slide>
						<button class="delete" on:click={clearErrors} />
						<h6 class="upload-limit-msg">Cannot add duplicate tags.</h6>
					</div>
				{/if}
				<div class="tag-show-box1" on:click={dispTagOnClick2}>
					<h3 class="show-tag-heading">Show tags</h3>
					<i id="angle-arrow" class="fa-solid fa-angle-down" />
				</div>
				{#if showTags2}
					<div in:slide out:slide class="block">
						{#if addedArtist != ''}
							<span in:slide out:fade class="tag is-black"
								>Artist: {addedArtist}<button class="delete" on:click={clearArtist} /></span
							>
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
				{/if}
			</div>
		{/if}
	</div>
</div>
{#if triggerModal}
	<div in:fade out:fade class="modal">
		<div on:click={toggleModal} class="modal-background" />
		<div class="modal-content">
			<img src={URL.createObjectURL(file)} alt=""/>
		</div>
		<button class="modal-close is-large" aria-label="close" on:click={toggleModal} />
	</div>
{/if}

<style>


	.tag-show-box1 {
		display: flex;
		justify-content: center;
	}

	.tag {
		margin: 5px;
	}

	.show-tag-heading {
		margin-right: 10px;
	}

	.button {
		margin-top: 5px;
		margin-bottom: 5px;
	}
	.modal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: max-content;
	}

	.modal-background {
		background-color: rgba(8, 8, 8, 0.8);
	}

	.modal img {
		margin-top: 5px;
		margin-bottom: 5px;
	}

	div {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}

	.pic {
		margin-bottom: 5px;
		width: 100%;
		height: 300px;
		cursor: pointer;
		background-repeat: no-repeat;
		background-size: cover;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	img {
		margin-top: 5px;
		margin-bottom: 5px;
		width: 300px;
	}

	

	@media only screen and (max-width: 600px) {
		.image {
			border-radius: 8px;
			padding-bottom: 10px;
			font-size: 30px;
			text-align: center;
			margin-top: 15px;
			margin-bottom: 15px;
			margin-left: 15px;
			margin-right: 15px;
			min-width: 300px;
			max-width: 300px;
			height: 90%;
			background: linear-gradient(315deg, #ca8ce6, #57dcdf);
			transition: all 150ms ease-in-out;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;
			align-self: center;
		}
	}

	.image {
		border-radius: 8px;
		padding-bottom: 10px;
		font-size: 30px;
		text-align: center;
		margin-top: 15px;
		margin-bottom: 15px;
		margin-left: 15px;
		margin-right: 15px;
		min-width: 300px;
		max-width: 300px;
		height: 90%;
		background: linear-gradient(315deg, #ca8ce6, #57dcdf);
		transition: all 150ms ease-in-out;
	}

	.image:hover {
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

	.parent {
		position: relative;
	}

	.btns {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
	}

	hr {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 80%;
	}

	.btns button {
		display: block;
		margin-left: auto;
		margin-right: auto;
		background: transparent;
		border: none;
		font-size: 18px;
		width: 80%;
	}

	.btns button:hover {
		background: white;
	}

	.search-bar {
		display: block;
		width: 80%;
		padding: 7px;
		border-radius: 1px;
		text-align: center;
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box; /* Opera/IE 8+ */
		margin-left: auto;
		margin-right: auto;
		margin-top: 15px;
		background: transparent;
		border-top: 1px;
		border-left: 1px;
		border-right: 1px;
	}

	input {
		font-size: 50%;
	}

	.tag-show-box {
		cursor: pointer;
	}

	.g {
		padding-top: 5px;
		padding-bottom: 5px;
		display: flex;
		justify-content: center;
		align-self: center;
	}
</style>
