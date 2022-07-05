<script>
	import { darkmode } from '../stores.js';
    import { slide } from "svelte/transition"

	// props
	export let tags;
	export let artists;

	let currentTag = '';
	let currentArtist = '';
	let tagSuggestions = [];
	let artistSuggestions = [];

	function getTagSuggestions() {
		const _tagSuggestions = [];

		for (const tag of tags) {
			if (tag.startsWith(currentTag)) {
				_tagSuggestions.push(tag);
			}
		}

		tagSuggestions = _tagSuggestions;
	}

	function getArtistSuggestions() {
		const _artistSuggestions = [];

		for (const artist of artists) {
			if (artist.startsWith(currentArtist)) {
				_artistSuggestions.push(artist);
			}
		}

		artistSuggestions = _artistSuggestions;
	}



</script>

<div>
	<h1 style="color : {$darkmode ? 'white' : 'black'}">Tags for this post</h1>
	<input
		bind:value={currentTag}
		on:input={getTagSuggestions}
		class="input is-primary"
		type="text"
		placeholder="Enter a tag name!"
	/>
	{#if currentTag.length}
        <div style="background-color: {$darkmode ? "white" : "black"}" class="suggestions">
            {#each tagSuggestions as suggestion}
			    <h1 class="search-option {$darkmode ? "is-dark" : "is-light"}" in:slide out:slide>{suggestion}</h1>
		    {/each}
        </div>
		
	{/if}
</div>

<div>
	<h1 style="color : {$darkmode ? 'white' : 'black'}">
		Artist for this post (An empty artist field will result in an automatic search for the image
		sources)
	</h1>
	<input
		bind:value={currentArtist}
		on:input={getArtistSuggestions}
		class="input is-primary"
		type="text"
		placeholder="Enter an artist name!"
	/>

	{#if currentArtist.length}
        <div style="background-color: {$darkmode ? "white" : "black"}" class="results">
            {#each artistSuggestions as suggestion}
			    <h4 class="search-option {$darkmode ? "is-dark" : "is-light"}" in:slide out:slide>{suggestion}</h4>
		    {/each}
        </div>
		
	{/if}

</div>

<style>

@media only screen and (min-width: 1024px) {
		.results {
			width: 100%;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			border: 1px solid;
			box-shadow: 1px 3px #888888;
		}

		.results h4 {
			margin: auto;
			cursor: pointer;
			width: 100%;
			font-size: 20px;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			/* transition: all 150ms ease-in-out; */
		}

		.results h4:hover {
			background-color: #888888;
		}
	}

	@media only screen and (max-width: 1023px) {
		

		.results {
			width: 100%;
			max-width: 254px;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			border: 1px solid;
			box-shadow: 1px 3px #888888;
			margin-bottom: 20px;
		}

		.results h4 {
			margin: auto;
			cursor: pointer;
			width: 100%;
			font-size: 16px;
			transition: all 150ms ease-in-out;
		}

		.results h4:hover {
			background-color: #888888;
		}
	}

	div {
		display: block;
		margin-left: auto;
		margin-right: auto;
        margin-bottom : 45px;
		width: 75%;
	}

    .suggestions {
        margin-top : 10px;
        
        border-radius : 10px;
    }

    .search-option:first-child:hover {
        border-top-left-radius : 10px;
        border-top-right-radius: 10px;
    }

    .search-option:last-child:hover {
        border-bottom-left-radius : 10px;
        border-bottom-right-radius: 10px;
    }

    

	h1 {
		text-align: center;
		font-size: 15px;
        padding : 5px;
	}


    
	input {
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding: 5px;
		width: 25%;
		text-align: center;
	}
	
</style>
