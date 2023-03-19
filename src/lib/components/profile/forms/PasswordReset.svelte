<script lang="ts">
	import Requirements from '$lib/components/auth/Requirements.svelte';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { fade, slide } from 'svelte/transition';

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
	</form>
</div>
