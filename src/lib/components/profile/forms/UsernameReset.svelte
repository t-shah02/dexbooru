<script lang="ts">
	import Requirements from '$lib/components/auth/Requirements.svelte';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { slide, fade } from 'svelte/transition';

	export let errorMessage: string = '';

	let username: string = '';
	let confirmedUsername: string = '';

	const onUsernameType = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		username = target.value;
	};

	const onConfirmedUsernameType = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		confirmedUsername = target.value;
	};
</script>

<div
	class="m-5 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
>
	<form class="space-y-6" method="POST" action="?/username">
		<h5 class="text-xl font-medium text-gray-900 dark:text-white">Change your username</h5>
		<div>
			<label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>New username</label
			>
			<input
				on:input={onUsernameType}
				name="username"
				id="username"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				placeholder="newuser1200"
				required
			/>
			<Requirements type="username" value={username} />
		</div>
		<div>
			<label
				for="usernameConfirm"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Confirm new username</label
			>
			<input
				on:input={onConfirmedUsernameType}
				name="usernameConfirm"
				id="usernameConfirm"
				placeholder="newuser1200"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				required
			/>
			{#if username !== confirmedUsername}
				<p in:fade out:slide class="text-sm text-red-500 dark:text-red-500 mt-2">
					The usernames don't match!!
				</p>
			{/if}
		</div>

		<button
			type="submit"
			class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Update</button
		>
		{#if errorMessage.length}
			<div
				class="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
				role="alert"
			>
				<svg
					aria-hidden="true"
					class="flex-shrink-0 inline w-5 h-5 mr-3"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/></svg
				>
				<span class="sr-only">Info</span>
				<div>
					<span class="font-medium">Error!</span>
					{errorMessage}
				</div>
			</div>
		{/if}
	</form>
</div>
