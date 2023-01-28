<script lang="ts">
	import type { MouseEvent } from '$lib/interfaces/inputs';
	import type { TagResponse, TagMapValue } from '$lib/interfaces/queries';
	import { fade } from 'svelte/transition';

	const letters = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	];

	const tagMap = new Map<string, TagMapValue>();

	let activeLetter = '';
	let previousLetter = '';
	let currentPage = 0;
	let tagResults: string[] = [];

	const fetchTagResults = async (letter: string, pageNumber: number) => {
		const response = await fetch(`/api/tags?qc=${letter}&page=${pageNumber}`);
		if (response.ok) {
			const data: TagResponse = await response.json();
			return data.results;
		}

		return [];
	};

	const handleLetterChange = async (event: MouseEvent<HTMLButtonElement>) => {
		const target = event.target as HTMLButtonElement;
		activeLetter = target.innerHTML;

		if (activeLetter === previousLetter) return;

		previousLetter = activeLetter;

		if (tagMap.has(activeLetter)) {
			const { tags, pageNumber } = tagMap.get(activeLetter) || { tags: [], pageNumber: 0 };
			tagResults = tags;
			currentPage = pageNumber;
			return;
		}

		tagResults = await fetchTagResults(activeLetter, currentPage);
		currentPage++;

		tagMap.set(activeLetter, { tags: tagResults, pageNumber: currentPage });
	};

	const loadMoreTags = async () => {
		currentPage++;
		const pageResultsForTag = await fetchTagResults(activeLetter, currentPage);
		tagResults = tagResults.concat(pageResultsForTag);

		tagMap.set(activeLetter, { tags: tagResults, pageNumber: currentPage });
	};
</script>

<svelte:head>
	<title>Tags</title>
</svelte:head>

<nav class="no-space">
	<a class="menu-item" style="margin-right : 0px" href="#{letters[0]}">
		<button on:click={handleLetterChange} class="border left-round small letter-btn"
			>{letters[0]}</button
		>
	</a>
	{#each letters.slice(1, -1) as letter}
		<a class="menu-item" href="#{letter}">
			<button on:click={handleLetterChange} class="border no-round small letter-btn"
				>{letter}</button
			>
		</a>
	{/each}
	<a class="menu-item" href="#{letters[letters.length - 1]}">
		<button on:click={handleLetterChange} class="border right-round small letter-btn"
			>{letters[letters.length - 1]}</button
		>
	</a>
</nav>

<h6 class="center-align">
	{activeLetter ? `#${activeLetter}` : 'Select a letter to display tags associated with it'}
</h6>

<div class="tag-grid">
	{#each tagResults as tagResult}
		<a in:fade class="tag-link chip border" href="/posts/{tagResult}">{tagResult}</a>
	{/each}
</div>

{#if currentPage}
	<button on:click={loadMoreTags} class="load-more-btn"> Load more tags </button>
{/if}

<style>
	.menu-item {
		width: 50px;
		height: 50px;
	}

	.letter-btn {
		font-size: 12px;
	}

	.load-more-btn {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 100px;
		margin-top: 50px;
	}

	nav {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	.tag-grid {
		margin-top: 30px;
		display: grid;
		max-width: 2400px;
		gap: 50px;
		place-items: center;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>
