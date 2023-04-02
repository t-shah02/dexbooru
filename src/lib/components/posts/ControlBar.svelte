<script lang="ts">
	import type { Post } from '$lib/interfaces/posts';
	import { footerData } from '$lib/stores/components';
	import { onMount } from 'svelte';
	import { Dropdown } from 'flowbite';
	import type { DropdownOptions, DropdownInterface } from 'flowbite';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { generatePostArrangements } from '$lib/query/postFilters';

	type SortOption = 'uploader' | 'date' | 'views' | '';
	type SortDirection = 'increasing' | 'decreasing' | '';

	export let posts: Post[] = [];

	let sortOption: SortOption = '';
	let sortDirection: SortDirection = '';

	const postArrangements = generatePostArrangements(posts);

	const rerenderPosts = () => {
		if (sortOption !== '' && sortDirection !== '') {
			posts = postArrangements[sortOption][sortDirection];
		}
	};

	function handleSortOptionSelect(event: FormEventHandler<HTMLInputElement>) {
		const target = event.target as HTMLInputElement;
		const selectedSortOption = target.dataset.option as SortOption;

		sortOption = selectedSortOption;
		rerenderPosts();
	}

	function handleSortDirectionSelect(event: FormEventHandler<HTMLInputElement>) {
		const target = event.target as HTMLInputElement;
		const selectedSortDirection = target.dataset.option as SortDirection;

		sortDirection = selectedSortDirection;
		rerenderPosts();
	}

	onMount(() => {
		const sortFloaterContainer = document.querySelector('#sort-floater') as HTMLDivElement;

		if (sortFloaterContainer) {
			sortFloaterContainer.classList.remove('opacity-0');
		}

		const sortByButton = document.querySelector('#sort-by-button') as HTMLElement;
		const sortByOptionsDropdown = document.querySelector('#sort-by-dropdown') as HTMLElement;
		const sortDirectionButton = document.querySelector('#sort-direction-button') as HTMLElement;
		const sortDirectionOptionsDropdown = document.querySelector(
			'#sort-direction-dropdown'
		) as HTMLElement;

		if (
			sortByButton &&
			sortByOptionsDropdown &&
			sortDirectionButton &&
			sortDirectionOptionsDropdown
		) {
			const options: DropdownOptions = {
				placement: 'top',
				triggerType: 'click',
				offsetSkidding: 0,
				offsetDistance: 10,
				delay: 300
			};

			const sortByDropdown: DropdownInterface = new Dropdown(
				sortByOptionsDropdown,
				sortByButton,
				options
			);

			const sortDirectionDropdown: DropdownInterface = new Dropdown(
				sortDirectionOptionsDropdown,
				sortDirectionButton,
				options
			);
		}
	});
</script>

<div
	id="sort-floater"
	style={$footerData.height > 0 ? `bottom: ${$footerData.height + 7}px` : ''}
	class="flex justify-center align-middle space-x-2 fixed opacity-0 z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600"
>
	<div>
		<button
			id="sort-by-button"
			class="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			type="button"
			>Sort-by <svg
				class="w-4 h-4 ml-2"
				aria-hidden="true"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 9l-7 7-7-7"
				/></svg
			></button
		>

		<div
			id="sort-by-dropdown"
			class="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
		>
			<ul
				class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
				aria-labelledby="sort-by-button"
			>
				<li>
					<div class="flex items-center">
						<input
							data-option="date"
							on:change={handleSortOptionSelect}
							id="upload-date-radio"
							type="radio"
							value=""
							name="sort-by"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
						/>
						<label for="sort-by" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>Upload date</label
						>
					</div>
				</li>
				<li>
					<div class="flex items-center">
						<input
							on:change={handleSortOptionSelect}
							data-option="views"
							id="views-radio"
							type="radio"
							value=""
							name="sort-by"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
						/>
						<label for="sort-by" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>Views</label
						>
					</div>
				</li>
				<li>
					<div class="flex items-center">
						<input
							on:change={handleSortOptionSelect}
							data-option="uploader"
							id="uploader-radio"
							type="radio"
							value=""
							name="sort-by"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
						/>
						<label for="sort-by" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>Uploader</label
						>
					</div>
				</li>
			</ul>
		</div>
	</div>

	<div>
		<button
			id="sort-direction-button"
			class="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			type="button"
			>Sort direction <svg
				class="w-4 h-4 ml-2"
				aria-hidden="true"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 9l-7 7-7-7"
				/></svg
			></button
		>

		<div
			id="sort-direction-dropdown"
			class="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
		>
			<ul
				class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
				aria-labelledby="sort-direction-button"
			>
				<li>
					<div class="flex items-center">
						<input
							on:change={handleSortDirectionSelect}
							data-option="increasing"
							id="default-radio-1"
							type="radio"
							value=""
							name="sort-direction"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
						/>
						<label
							for="sort-direction"
							class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Increasing</label
						>
					</div>
				</li>
				<li>
					<div class="flex items-center">
						<input
							on:change={handleSortDirectionSelect}
							data-option="decreasing"
							id="default-radio-2"
							type="radio"
							value=""
							name="sort-direction"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
						/>
						<label
							for="sort-direction"
							class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Decreasing</label
						>
					</div>
				</li>
			</ul>
		</div>
	</div>
</div>
