<script>
	import { darkmode, addedTags, addedArtist } from '../stores.js';
	import { slide, fade, fly } from 'svelte/transition';
	import { darkCardColor, lightModeColor, darkNavbarColor } from '../colors.js';

	// props
	export let tags;
	export let artists;

	let currentTag = '';
	let currentArtist = '';
	let tagSuggestions = [];
	let artistSuggestions = [];

	//tags variables
	let isQueryEmpty = false;
	let isQueryTooLong = false;
	let isTagsTooLong = false;
	let doesTagExist = false;
	let isArtistEmpty = false;
	let isArtistTooLong = false;

	let colors = ['is-success', 'is-link', 'is-warning', 'is-danger', 'is-primary'];

	function addToTags(string) {
		currentTag = string;
	}

	function addToArtist(string) {
		currentArtist = string;
	}

	function getTagSuggestions() {
		if (!currentTag.length) {
			return;
		}

		const _tagSuggestions = [];
		
		for (const tag of tags) {
			if (_tagSuggestions.length > 4) {
				break;
			}
			if (tag.startsWith(currentTag)) {
				_tagSuggestions.push(tag);
			}
		}

		console.log(_tagSuggestions);

		tagSuggestions = _tagSuggestions;
	}

	function getArtistSuggestions() {
		const _artistSuggestions = [];

		for (const artist of artists) {
			if (_artistSuggestions.length > 4) {
				break;
			}

			if (artist.startsWith(currentArtist)) {
				_artistSuggestions.push(artist);
			}
		}

		artistSuggestions = _artistSuggestions;
	}

	//add/remove tags and artists
	function addArtist() {
		if (currentArtist == '') {
			isArtistEmpty = true;
		} else if (currentArtist.length > 30) {
			isArtistTooLong = true;
		} else {
			isArtistEmpty = false;
			isArtistTooLong = false;
			$addedArtist = currentArtist;
		}
	}

	function addTag() {
		if (currentTag == '') {
			isQueryEmpty = true;
		} else if (currentTag.length > 30) {
			isQueryTooLong = true;
		} else if ($addedTags.size > 10) {
			isTagsTooLong = true;
		} else if ($addedTags.has(currentTag)) {
			doesTagExist = true;
		} else {
			isQueryEmpty = false;
			isQueryTooLong = false;
			isTagsTooLong = false;
			doesTagExist = false;
			$addedTags.add(currentTag.toLowerCase());
			addedTags.set(new Set($addedTags));
			currentTag = '';	
		}
	}

	function clearArtist() {
		addedArtist.set("");
	}

	function deleteTag(tag) {
		$addedTags.delete(tag);
		addedTags.set(new Set($addedTags));
	}

	function clearTag() {
		addedTags.set(new Set());
	}

</script>

<div>
	{#if isQueryEmpty}
		<div class="notification is-danger" in:slide out:slide>
			<button class="delete" on:click={() => (isQueryEmpty = false)} />
			<h6 class="upload-limit-msg">Tags cannot be empty.</h6>
		</div>
	{/if}
	{#if isQueryTooLong}
		<div class="notification is-danger" in:slide out:slide>
			<button class="delete" on:click={() => (isQueryTooLong = false)} />
			<h6 class="upload-limit-msg">Please limit tags to 30 characters.</h6>
		</div>
	{/if}
	{#if isTagsTooLong}
		<div class="notification is-danger" in:slide out:slide>
			<button class="delete" on:click={() => (isTagsTooLong = false)} />
			<h6 class="upload-limit-msg">You have reached the maximum number of tags allowed.</h6>
		</div>
	{/if}
	{#if isArtistTooLong}
		<div class="notification is-danger" in:slide out:slide>
			<button class="delete" on:click={() => (isArtistTooLong = false)} />
			<h6 class="upload-limit-msg">Please limit artist to 30 characters.</h6>
		</div>
	{/if}
	{#if isArtistEmpty}
		<div class="notification is-danger" in:slide out:slide>
			<button class="delete" on:click={() => (isArtistEmpty = false)} />
			<h6 class="upload-limit-msg">Cannot add an empty artist.</h6>
		</div>
	{/if}
	{#if doesTagExist}
		<div class="notification is-danger" in:slide out:slide>
			<button class="delete" on:click={() => (doesTagExist = false)} />
			<h6 class="upload-limit-msg">Cannot add duplicate tags.</h6>
		</div>
	{/if}
	<h1 style="color : {$darkmode ? 'white' : 'black'}">Tags for this post</h1>
	<div class="tagSearch">
		<input
			bind:value={currentTag}
			on:input={getTagSuggestions}
			class="input is-primary"
			type="text"
			placeholder="Enter a tag name!"
		/>
		{#if currentTag.length}
			<div in:slide out:slide style="background-color : {$darkmode ? darkCardColor : lightModeColor}" class="results">
				{#if !tagSuggestions.length}
					<h4 style="color : {$darkmode ? lightModeColor : darkNavbarColor}">NO EXISTING TAGS MATCH</h4>
				{/if}
				{#each tagSuggestions as suggestion}
					<h4
						class="search-option"
						style="color : {$darkmode ? lightModeColor : darkNavbarColor}"
						on:click={() => addToTags(suggestion)}
					>
						{suggestion}
					</h4>
				{/each}
			</div>
		{/if}
	</div>
	<div class="buttons">
		<button on:click={addTag} class="button is-primary">ADD TAG</button>
		<button on:click={clearTag} class="button is-danger">CLEAR ALL TAGS</button>
	</div>
	<div>
		<h1 style="color : {$darkmode ? 'white' : 'black'}">
			Artist for this post (An empty artist field will result in an automatic search for the image
			sources)
		</h1>
		<div class="tagSearch">
			<input
				bind:value={currentArtist}
				on:input={getArtistSuggestions}
				class="input is-primary"
				type="text"
				placeholder="Enter an artist name!"
			/>

			{#if currentArtist.length}
				<div style="background-color : {$darkmode ? darkCardColor : lightModeColor}" class="results">
					{#if !artistSuggestions.length}
						<h4 style="color : {$darkmode ? lightModeColor : darkNavbarColor}">NO EXISTING ARTISTS MATCH</h4>
					{/if}
					{#each artistSuggestions as suggestion}
						<h4
							class="search-option"
							style="color : {$darkmode ? lightModeColor : darkNavbarColor}"
							on:click={() => addToArtist(suggestion)}
						>
							{suggestion}
						</h4>
					{/each}
				</div>
			{/if}
		</div>
		<div class="buttons">
			<button on:click={addArtist} class="button is-primary">ADD ARTIST</button>
			<button on:click={clearArtist} class="button is-danger">CLEAR ARTIST</button>
		</div>
	</div>

	<div in:slide out:slide class="block">
		<h3 style= "color : {$darkmode ? lightModeColor : darkNavbarColor}">TAGS AND ARTISTS</h3>
		{#if $addedArtist != ''}
			<span in:slide out:fade class="tag is-black"
				>Artist: {$addedArtist}<button class="delete" on:click={clearArtist} /></span
			>
		{/if}
		{#each Array.from($addedTags) as tag}
			<span in:slide out:fade class="tag {colors[Math.floor(Math.random() * colors.length)]}"
				>{tag}<button class="delete" on:click={() => deleteTag(tag)} /></span
			>
		{/each}
	</div>
</div>


<style>

	.tagSearch {
		width: 75%;
		max-width: 1000px;
	}
	.results {
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		border: 1px solid;
		box-shadow: 1px 3px #888888;
		transition: all 200ms ease-in-out;
	}

	.results h4 {
		padding-left: 0.5%;
		padding-top: 5px;
		padding-bottom: 5px;
		cursor: pointer;
		font-size: 20px;
		/* transition: all 150ms ease-in-out; */
	}

	.results h4:hover {
		background-color: #888888;
	}

	div {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 45px;
	}

	.suggestions {
		margin-top: 10px;

		border-radius: 10px;
	}

	h1 {
		text-align: center;
		font-size: 15px;
		padding: 5px;
	}

	input {
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding: 5px;
		text-align: center;
		transition: all 200ms ease-in-out;
	}

	input:focus {
		transform: scaleX(1.05);
	}

	input:focus ~ .results {
		transform: scaleX(1.05);
	}

	.tag-show-box1 {
		display: flex;
		justify-content: center;
		cursor: pointer;
	}

	.buttons {
		display: flex;
		margin-top: 20px;
	}

	.buttons button {
		display: flex;
		margin-left: auto;
		margin-right: auto;
		font-size: 18px;
	}

	.block {
		margin-left: 10%;
		margin-right: 10%;
	}

	.tag-show-box1 {
		display: flex;
		justify-content: center;
	}

	.tag {
		margin: 5px;
	}

	h3 {
		font-size: 20px;
		text-align: center;
		border: 1px solid;
		border-radius: 10px 10px 10px 10px;
		margin-bottom: 15px;
	}

	@keyframes search-animation {
  	from {
    	opacity: 0;
  	}
  	50% {
    	opacity: 0.5;
  	}
  	to {
    	opacity: 0;
  	}
}
</style>
