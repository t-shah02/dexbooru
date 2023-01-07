<script lang="ts">
	import type { MouseEvent } from '$lib/interfaces/inputs';

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

	let activeLetter = '';

	const handleLetterChange = (event: MouseEvent<HTMLButtonElement>) => {
		const target = event.target as HTMLButtonElement;
		activeLetter = target.innerHTML;
	};
</script>

<nav class="no-space">
	<a style="margin-right : 0px" href="#{letters[0]}">
		<button on:click={handleLetterChange} class="border left-round small">{letters[0]}</button>
	</a>
	{#each letters.slice(1, -1) as letter}
		<a href="#{letter}">
			<button on:click={handleLetterChange} class="border no-round small">{letter}</button>
		</a>
	{/each}
	<a href="#{letters[letters.length - 1]}">
		<button on:click={handleLetterChange} class="border right-round small"
			>{letters[letters.length - 1]}</button
		>
	</a>
</nav>

<h6 class="center-align">
	{activeLetter ? `#${activeLetter}` : 'Select a letter to display tags associated with it'}
</h6>

<style>
	a {
		width: 50px;
		height: 50px;
	}

	button {
		font-size: 12px;
	}

	nav {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
