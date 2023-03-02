<script lang="ts">
	import { Dropdown } from 'flowbite';
	import type { DropdownOptions, DropdownInterface } from 'flowbite';
	import { onMount } from 'svelte';
	import type { FormEventHandler } from '$lib/interfaces/inputs';

	type DropdownOption = 'General' | 'Tags' | 'Artists' | 'Users';

	const searchPlaceholderMapping = {
		General: 'Search for anything on Dexbooru',
		Tags: 'Search for tags on Dexbooru',
		Artists: 'Search for artists on Dexbooru',
		Users: 'Search for users on Dexbooru'
	};

	let dropdown: DropdownInterface;
	let option: DropdownOption = 'General';
	let canSearch = true;
	let results = null;

	const selectSearchOption = (event: FormEventHandler<HTMLButtonElement>) => {
		const target = event.target as HTMLButtonElement;
		const value = target.innerText;
		option = value as DropdownOption;

		dropdown.hide();
	};

	const getAutocompleteResults = async (event: FormEventHandler<HTMLInputElement>) => {
		if (!canSearch) return;

		const target = event.target as HTMLInputElement;
		const value = target.value;

		if (value === '') return;

		const autocompleteURL = new URL('/api/autocomplete', document.location.toString());
		autocompleteURL.searchParams.append('q', value);
		autocompleteURL.searchParams.append('type', option.toLowerCase());

		const response = await fetch(autocompleteURL);
		results = await response.json();

		canSearch = false;

		setTimeout(async () => {
			canSearch = true;

			const newValue = target.value;
			if (newValue !== value) {
				await getAutocompleteResults(event);
			}
		}, 2500);
	};

	onMount(() => {
		const triggerElement = document.querySelector('#search-trigger');
		const dropdownElement = document.querySelector('#dropdown');

		if (triggerElement && dropdownElement) {
			const options: DropdownOptions = {
				placement: 'bottom',
				triggerType: 'click',
				offsetSkidding: 0,
				offsetDistance: 5,
				delay: 300
			};

			dropdown = new Dropdown(
				dropdownElement as HTMLElement,
				triggerElement as HTMLElement,
				options
			);
		}
	});
</script>

<form>
	<div class="flex">
		<div class="relative max-w-sm">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<svg
					aria-hidden="true"
					class="w-5 h-5 text-gray-500 dark:text-gray-400"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
						clip-rule="evenodd"
					/></svg
				>
			</div>
		</div>
		<button
			id="search-trigger"
			class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
			type="button"
			>{!option.length ? 'Select a search option' : option}<svg
				aria-hidden="true"
				class="w-4 h-4 ml-1"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/></svg
			></button
		>
		<div
			id="dropdown"
			class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
		>
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
				<li>
					<button
						on:click={selectSearchOption}
						type="button"
						class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>General</button
					>
				</li>
				<li>
					<button
						on:click={selectSearchOption}
						type="button"
						class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Tags</button
					>
				</li>
				<li>
					<button
						on:click={selectSearchOption}
						type="button"
						class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Artists</button
					>
				</li>
				<li>
					<button
						on:click={selectSearchOption}
						type="button"
						class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Users</button
					>
				</li>
			</ul>
		</div>
		<div class="relative w-full">
			<input
				on:input={getAutocompleteResults}
				type="search"
				id="search-dropdown"
				class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
				placeholder={searchPlaceholderMapping[option]}
				required
			/>
			<button
				type="submit"
				class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				<svg
					aria-hidden="true"
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/></svg
				>
				<span class="sr-only">Search</span>
			</button>
		</div>
	</div>
</form>

{JSON.stringify(results)}

<style>
	form {
		width: 90%;
	}
</style>
