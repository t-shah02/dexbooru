<script lang="ts">
	import Requirements from '$lib/components/auth/Requirements.svelte';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { fade, slide } from 'svelte/transition';

	export let context: string = '';
	export let message: string = '';

	let password: string = '';
	let confirmedPassword: string = '';

	const onPasswordType = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		password = target.value;
	};

	const onConfirmedPasswordType = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		confirmedPassword = target.value;
	};
</script>

<div
	class="m-5 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
>
	<form class="space-y-6" method="POST" action="?/password">
		<h5 class="text-xl font-medium text-gray-900 dark:text-white">Change your password</h5>
		<div>
			<label for="oldPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Enter your old password</label
			>
			<input
				type="password"
				name="oldPassword"
				id="oldPassword"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				placeholder="••••••••"
				required
			/>
		</div>
		<div>
			<label for="newPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Enter your new password</label
			>
			<input
				on:input={onPasswordType}
				type="password"
				name="newPassword"
				id="newPassword"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				placeholder="••••••••"
				required
			/>
			<Requirements type="password" value={password} />
		</div>
		<div>
			<label
				for="newPasswordConfirm"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Confirm your new password</label
			>
			<input
				on:input={onConfirmedPasswordType}
				type="password"
				name="newPasswordConfirm"
				id="newPasswordConfirm"
				placeholder="••••••••"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				required
			/>
			{#if password !== confirmedPassword}
				<p in:fade out:slide class="text-sm text-red-500 dark:text-red-500 mt-2">
					The passwords don't match!!
				</p>
			{/if}
		</div>
		<button
			type="submit"
			class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Update</button
		>
		{#if context === 'pass'}
			<div
				class="flex p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
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
					<span class="font-medium">Success!</span>
					{message}
				</div>
			</div>
		{/if}

		{#if context === 'fail'}
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
					{message}
				</div>
			</div>
		{/if}
	</form>
</div>
