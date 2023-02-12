<script lang="ts">
	import appLogo from '$lib/assets/logo.ico';
	import DarkmodeToggle from './DarkmodeToggle.svelte';

	export let user: UserApp | undefined;
</script>

<nav
	class="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600"
>
	<div class="container flex flex-wrap items-center justify-between mx-auto">
		<a href="/" class="flex items-center">
			<img src={appLogo} class="h-6 mr-3 sm:h-9 rounded-full" alt="Dexbooru Logo" />
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>Dexbooru</span
			>
		</a>
		<div class="flex md:order-2">
			{#if user}
				<button
					id="dropdownAvatarNameButton"
					data-dropdown-toggle="dropdownAvatarName"
					class="flex items-center text-sm font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:mr-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
					type="button"
				>
					<span class="sr-only">Open user menu</span>
					<img
						class="w-8 h-8 mr-2 rounded-full"
						src={user.profilePictureUrl}
						alt="profile for {user.username}"
					/>
					{user.username}
					<svg
						class="w-4 h-4 mx-1.5"
						aria-hidden="true"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/></svg
					>
				</button>

				<!-- Dropdown menu -->
				<div
					id="dropdownAvatarName"
					class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
				>
					<div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
						<div class="font-medium ">Basic User</div>
						<div class="truncate">{user?.email}</div>
					</div>
					<ul
						class="py-2 text-sm text-gray-700 dark:text-gray-200"
						aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
					>
						<li>
							<a
								href="/profile/{user.username}"
								class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
								>Profile</a
							>
						</li>
						<li>
							<a
								href="/history"
								class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
								>History</a
							>
						</li>
					</ul>
					<div class="py-2">
						<a
							href="/auth/signout"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
							>Sign out</a
						>
					</div>
				</div>
			{/if}
			<DarkmodeToggle />
			<button
				data-collapse-toggle="navbar-sticky"
				type="button"
				class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				aria-controls="navbar-sticky"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
		</div>
		<div
			class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
			id="navbar-sticky"
		>
			<ul
				class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				<li>
					<a
						href="/"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
						>Home</a
					>
				</li>
				<li>
					<a
						href="/artists"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
						>Artists</a
					>
				</li>
				<li>
					<a
						href="/tags"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
						>Tags</a
					>
				</li>
				{#if user === undefined}
					<li>
						<a
							href="/auth/login"
							class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>Login</a
						>
					</li>
					<li>
						<a
							href="/auth/signup"
							class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>Sign up</a
						>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>
