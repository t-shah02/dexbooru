<script lang="ts">
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { uploadPost } from '$lib/stores/uploadStores';

	let artists: string[] = [];
	let tags: string[] = [];

	let tagInput: HTMLInputElement;
	let artistInput: HTMLInputElement;

	let currentTag: string = '';
	let currentArtist: string = '';

	const updatePost = (tags: string[], artists: string[]) => {
		const postData = { ...$uploadPost };
		postData.tags = tags;
		postData.artists = artists;
		uploadPost.set(postData);
	};

	const addTag = () => {
		if (!currentTag.length) return;

		tags.push(currentTag.toLocaleLowerCase());
		tags = Array.from(new Set(tags));
		tagInput.value = '';
		currentTag = '';

		updatePost(tags, artists);
	};

	const addArtist = () => {
		if (!currentArtist.length) return;

		artists.push(currentArtist.toLocaleLowerCase());
		artists = Array.from(new Set(artists));
		artistInput.value = '';
		currentArtist = '';

		updatePost(tags, artists);
	};

	const deleteTag = (event: FormEventHandler<HTMLButtonElement>) => {
		let target: HTMLElement = event.target as HTMLButtonElement;

		if (target.nodeName === 'I') {
			if (target.parentElement) {
				target = target.parentElement;
			}
		}

		const tagValue = target.dataset.value;
		tags = tags.filter((tag) => tag !== tagValue);

		updatePost(tags, artists);
	};

	const deleteArtist = (event: FormEventHandler<HTMLButtonElement>) => {
		let target: HTMLElement = event.target as HTMLButtonElement;

		if (target.nodeName === 'I') {
			if (target.parentElement) {
				target = target.parentElement;
			}
		}

		const artistValue = target.dataset.value;
		artists = artists.filter((artist) => artist !== artistValue);

		updatePost(tags, artists);
	};
</script>

<div class="flex flex-col">
	<div>
		<label
			for="default-input"
			class="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white"
			>Enter a tag name</label
		>
		<input
			bind:this={tagInput}
			bind:value={currentTag}
			placeholder="Some tag"
			type="text"
			id="default-input"
			class="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		/>
		<button
			on:click={addTag}
			type="button"
			class="mt-2 block ml-auto mr-auto focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>Add tag</button
		>
	</div>
	<div>
		<label
			for="default-input"
			class="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white"
			>Enter an artist name</label
		>
		<input
			bind:this={artistInput}
			bind:value={currentArtist}
			placeholder="Some artist"
			type="text"
			id="default-input"
			class="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		/>
		<button
			on:click={addArtist}
			type="button"
			class="mt-2 block ml-auto mr-auto focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>Add artist</button
		>
	</div>
</div>

<div class="added-items flex flex-col">
	<ul class="mt-5 flex flex-wrap items-center justify-center mb-6 text-gray-900 dark:text-white">
		{#each $uploadPost.tags as tag}
			<li>
				<button
					data-value={tag}
					on:click={deleteTag}
					type="button"
					class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
				>
					<i class="fa-solid fa-tag mr-3" />
					{tag}
					<i class="ml-3 fa-solid fa-circle-xmark" />
				</button>
			</li>
		{/each}
	</ul>

	<ul
		class="added-items  flex flex-wrap items-center justify-center mb-6 text-gray-900 dark:text-white"
	>
		{#each $uploadPost.artists as artist}
			<li>
				<button
					data-value={artist}
					on:click={deleteArtist}
					type="button"
					class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
				>
					<i class="fa-solid fa-palette mr-3" />
					{artist}
					<i class="ml-3 fa-solid fa-circle-xmark" />
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.added-items {
		width: 500px;
	}
</style>
