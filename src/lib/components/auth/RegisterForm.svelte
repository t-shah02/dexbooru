<script lang="ts">
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { fade, slide } from 'svelte/transition';
	import MessageToast from '../MessageToast.svelte';
	import ProfileUpload from './ProfileUpload.svelte';
	import Requirements from './Requirements.svelte';

	export let errorMessage: string = '';

	let username = '';
	let password = '';
	let passwordConfirm = '';

	const onUsernameChange = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		username = target.value;
	};

	const onPasswordChange = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		password = target.value;
	};

	const onPasswordConfirmChange = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		passwordConfirm = target.value;
	};
</script>

<div
	class="auth-form w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
>
	{#if errorMessage.length}
		<MessageToast marginTop={5} type="error" message={errorMessage} />
	{/if}
	<form class="space-y-6" method="POST" enctype="multipart/form-data" autocomplete="off">
		<h5 class="text-xl font-medium text-gray-900 dark:text-white">Sign up for Dexbooru</h5>
		<div>
			<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Enter your email</label
			>
			<input
				type="email"
				name="email"
				id="email"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				placeholder="name@company.com"
				required
			/>
		</div>
		<div>
			<label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Enter your username</label
			>
			<input
				on:input={onUsernameChange}
				type="text"
				name="username"
				id="username"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				placeholder="dexchan1200"
				required
			/>
			<Requirements type={'username'} bind:value={username} />
		</div>

		<ProfileUpload />

		<div>
			<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Enter your password</label
			>
			<input
				on:input={onPasswordChange}
				type="password"
				name="password"
				id="password"
				placeholder="••••••••"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				required
			/>
			<Requirements type={'password'} bind:value={password} />
		</div>

		<div>
			<label
				for="passwordConfirm"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Re-enter your password</label
			>
			<input
				on:input={onPasswordConfirmChange}
				type="password"
				name="passwordConfirm"
				id="passwordConfirm"
				placeholder="••••••••"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				required
			/>

			{#if password !== passwordConfirm}
				<p in:fade out:slide class="text-sm text-red-500 dark:text-red-500 mt-2">
					The password don't match!!
				</p>
			{/if}
		</div>

		<button
			type="submit"
			class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Sign up your account</button
		>
	</form>
</div>

<style>
	.auth-form {
		margin-top: 100px;
		margin-bottom: 100px;
	}
</style>
