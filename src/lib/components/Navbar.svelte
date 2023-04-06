<script lang="ts">
	import appLogo from '$lib/assets/logo.ico';
	import DarkmodeToggle from './DarkmodeToggle.svelte';
	import { authenticatedUser } from '$lib/stores/userStores';
	import SearchToggle from './search/SearchToggle.svelte';
	import ProfileDropdown from './navigation/ProfileDropdown.svelte';
	import NavItems from './navigation/NavItems.svelte';
	import FriendDropdown from './notifications/friends/FriendDropdown.svelte';
</script>

<nav
	id="dexbooru-navbar"
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
			<div class="flex flex-wrap space-x-3">
				<ProfileDropdown />
				{#if $authenticatedUser}
					<FriendDropdown />
				{/if}

				<SearchToggle />
				<DarkmodeToggle />
			</div>

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
			<NavItems />
		</div>
	</div>
</nav>
