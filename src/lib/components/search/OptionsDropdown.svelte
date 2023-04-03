<script lang="ts">
	import type {
		AutocompleteResults,
		AutocompleteSearchType,
		UserResult
	} from '$lib/interfaces/queries';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { search } from '$lib/stores/searchStores';
	import type { FormEventHandler } from '$lib/interfaces/inputs';

	export let results: string[];
	export let searchType: AutocompleteSearchType;

	let optionListItems: HTMLCollection | null = null;
	let index = 0;

	onMount(() => {
		const optionList = document.querySelector('#search-options');

		if (optionList) {
			optionListItems = optionList.children;
		}
	});

	const focusDown = (currentTarget: HTMLLIElement) => {
		if (optionListItems) {
			index = index + 1 >= optionListItems.length ? 0 : index + 1;

			const nextOptionLI = optionListItems.item(index) as HTMLLIElement;
			currentTarget.blur();
			nextOptionLI.focus();
		}
	};

	const focusUp = (currentTarget: HTMLLIElement) => {
		if (optionListItems) {
			index = index - 1 < 0 ? optionListItems.length - 1 : index - 1;

			const nextOptionLI = optionListItems.item(index) as HTMLLIElement;
			currentTarget.blur();
			nextOptionLI.focus();
		}
	};

	const handleOptionKeys = (event: KeyboardEvent) => {
		const target = event.target as HTMLLIElement;

		if (event.key === 'Enter') {
			addValue(target.innerText);
			target.blur();
		} else if (event.key === 'ArrowDown') {
			focusDown(target);
		} else if (event.key === 'ArrowUp') {
			focusUp(target);
		}
	};

	const handleOptionClick = (event: FormEventHandler<HTMLLIElement>) => {
		const target = event.target as HTMLLIElement;
		addValue(target.innerText);
	};

	const addValue = (value: string) => {
		const searchCopy = { ...$search };

		switch (searchType) {
			case 'artists':
				searchCopy.artists?.push(value);
				searchCopy.artists = Array.from(new Set(searchCopy.artists));
				break;
			case 'tags':
				searchCopy.tags?.push(value);
				searchCopy.tags = Array.from(new Set(searchCopy.tags));
				break;
			case 'uploader':
				searchCopy.uploader = value;
				break;
			default:
				break;
		}

		search.set(searchCopy);
	};
</script>

<div
	class="suggestions-dropdown max-w-full flex flex-col bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700"
>
	<ul class="max-w-full divide-y divide-gray-200 dark:divide-gray-700" id="search-options">
		{#each results as result}
			<li
				on:keydown={handleOptionKeys}
				on:click={handleOptionClick}
				in:slide
				out:slide
				tabindex="0"
				class="bg-white border border-gray-200 shadow focus:bg-gray-100 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 focus:dark:bg-gray-700"
			>
				<p class="text-sm text-center font-medium text-gray-900 truncate dark:text-white">
					{result}
				</p>
			</li>
		{/each}
	</ul>
</div>

<style>
	li:hover {
		cursor: pointer;
	}

	.suggestions-dropdown {
		width: 100%;
		position: absolute;
		top: 45px;
		z-index: 2;
	}
</style>
