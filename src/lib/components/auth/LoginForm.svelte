<script lang="ts">
	import MessageToast from '../MessageToast.svelte';

	export let errorMessage: string;
</script>

<div
	class="auth-form w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
>
	{#if errorMessage.length}
		<MessageToast marginTop={5} type="error" message={errorMessage} />
	{/if}
	<form class="space-y-6" method="POST">
		<h5 class="text-xl font-medium text-gray-900 dark:text-white">Log in to Dexbooru</h5>
		<div>
			<label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Enter your Username</label
			>
			<input
				type="text"
				name="username"
				id="username"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				placeholder="dexchan1200"
				required
			/>
		</div>
		<div>
			<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Enter your Password</label
			>
			<input
				type="password"
				name="password"
				id="password"
				placeholder="••••••••"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				required
			/>
		</div>
		<div class="flex items-start">
			<div class="flex items-start">
				<div class="flex items-center h-5">
					<input
						id="remember"
						type="checkbox"
						value=""
						class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
					/>
				</div>
				<label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Remember me</label
				>
			</div>
		</div>
		<button
			type="submit"
			class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Login to your account</button
		>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Not registered? <a
				href="/auth/signup"
				class="text-blue-700 hover:underline dark:text-blue-500">Create account</a
			>
		</div>
	</form>
</div>

<style>
</style>
