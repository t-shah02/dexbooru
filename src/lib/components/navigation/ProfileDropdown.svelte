<script lang="ts">
	import { authenticatedUser } from '$lib/stores/userStores';
	import { Dropdown } from 'flowbite';
	import type { DropdownOptions, DropdownInterface } from 'flowbite';
	import { onMount } from 'svelte';

	let userDropdown: DropdownInterface | null = null;

	onMount(() => {
		const authUserDropdownButton = document.querySelector(
			'#authenticated-user-dropdown-button'
		) as HTMLElement;
		const authUserDropdownMenu = document.querySelector(
			'#authenticated-user-dropdown-menu'
		) as HTMLElement;

		if (authUserDropdownButton && authUserDropdownMenu) {
			const options: DropdownOptions = {
				placement: 'bottom',
				triggerType: 'click',
				offsetSkidding: 0,
				offsetDistance: 10,
				delay: 300
			};

			userDropdown = new Dropdown(authUserDropdownMenu, authUserDropdownButton, options);
		}
	});
</script>

{#if $authenticatedUser}
	<button
		id="authenticated-user-dropdown-button"
		class="flex items-center text-sm font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:mr-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
		type="button"
	>
		<span class="sr-only">Open user menu</span>
		<img
			class="w-8 h-8 mr-2 rounded-full"
			src={$authenticatedUser.profilePictureUrl}
			alt="profile for {$authenticatedUser.username}"
		/>
		{$authenticatedUser.username}
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
		id="authenticated-user-dropdown-menu"
		class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
	>
		<div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
			<div class="font-medium">Basic User</div>
			<div class="truncate">{$authenticatedUser.email}</div>
		</div>
		<ul
			class="py-2 text-sm text-gray-700 dark:text-gray-200"
			aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
		>
			<li>
				<a
					data-sveltekit-reload
					href="/profile/{$authenticatedUser.username}"
					class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
					>Profile</a
				>
			</li>
			<li>
				<a
					href="/auth/posts/created"
					class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
					>Your posts</a
				>
			</li>
			<li>
				<a
					href="/auth/posts/saved"
					class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
					>Saved posts</a
				>
			</li>
			<li>
				<a
					href="/auth/settings"
					class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
					>Settings</a
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
