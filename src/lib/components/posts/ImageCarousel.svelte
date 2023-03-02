<script lang="ts">
	import { Carousel } from 'flowbite';
	import type { CarouselItem, CarouselOptions, CarouselInterface } from 'flowbite';
	import { onMount } from 'svelte';

	export let images: string[];

	onMount(() => {
		const items: CarouselItem[] = [];
		const indicatorItems: CarouselItem[] = [];

		for (let i = 0; i < images.length; i++) {
			const slideItem: CarouselItem = {
				position: i,
				el: document.querySelector(`#image-item-${i}`) as HTMLElement
			};

			const indicatorItem: CarouselItem = {
				position: i,
				el: document.querySelector(`#carousel-indicator-${i}`) as HTMLElement
			};

			items.push(slideItem);
			indicatorItems.push(indicatorItem);
		}

		const options: CarouselOptions = {
			defaultPosition: 0,
			interval: 3000,

			indicators: {
				activeClasses: 'bg-white dark:bg-gray-800',
				inactiveClasses: 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
				items: indicatorItems
			}
		};

		const carousel: CarouselInterface = new Carousel(items, options);

		// set event listeners for prev and next buttons
		const prevButton = document.getElementById('data-carousel-prev');
		const nextButton = document.getElementById('data-carousel-next');

		if (prevButton && nextButton) {
			prevButton.addEventListener('click', () => {
				carousel.prev();
			});

			nextButton.addEventListener('click', () => {
				carousel.next();
			});
		}
	});
</script>

<div class="relative">
	<!-- Carousel wrapper -->
	<div class="relative h-56 overflow-hidden rounded-lg sm:h-64 xl:h-80 2xl:h-96">
		{#each Object.entries(images) as [index, image]}
			<div id="image-item-{index}" class="hidden duration-700 ease-in-out">
				<span
					class="absolute text-2xl font-semibold text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 sm:text-3xl dark:text-gray-800"
					>Image Slide # {index + 1}</span
				>
				<img
					src={image}
					class="absolute object-contain block w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
					alt="slide # {index + 1} "
				/>
			</div>
		{/each}
	</div>
	<!-- Slider indicators -->
	<div class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
		{#each Object.entries(images) as [index, _]}
			<button
				id="carousel-indicator-{index}"
				type="button"
				class="w-3 h-3 rounded-full"
				aria-current="true"
				aria-label="Slide {index + 1}"
			/>
		{/each}
	</div>
	<!-- Slider controls -->
	<button
		id="data-carousel-prev"
		type="button"
		class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
	>
		<span
			class="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
		>
			<svg
				class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 19l-7-7 7-7"
				/></svg
			>
			<span class="hidden">Previous</span>
		</span>
	</button>
	<button
		id="data-carousel-next"
		type="button"
		class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
	>
		<span
			class="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
		>
			<svg
				class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5l7 7-7 7"
				/></svg
			>
			<span class="hidden">Next</span>
		</span>
	</button>
</div>
