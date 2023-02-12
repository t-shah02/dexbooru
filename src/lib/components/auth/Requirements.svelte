<script lang="ts">
	import { isStrongPassword, isValidUsername } from '$lib/auth/helpers';
	import Checkmark from '../svgs/Checkmark.svelte';
	import Cross from '../svgs/Cross.svelte';
	import { slide } from 'svelte/transition';

	export let type: 'username' | 'password';
	export let value: string;

	let state: boolean | string[][] = false;

	$: {
		if (value.length) {
			state = type === 'username' ? isValidUsername(value) : isStrongPassword(value);
		} else {
			state = false;
		}
	}
</script>

{#if state}
	{#if typeof state !== 'boolean'}
		<div in:slide out:slide>
			<h2 class="mb-2 mt-2 text-lg font-semibold text-gray-900 dark:text-white">
				{type.charAt(0).toUpperCase() + type.slice(1)} requirements:
			</h2>
			<ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
				{#each state[0] as requirement}
					<li class="flex items-center">
						<Checkmark />
						{requirement}
					</li>
				{/each}

				{#each state[1] as requirement}
					<li class="flex items-center">
						<Cross />
						{requirement}
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<p class="text-sm text-green-500 dark:text-green-500 mt-2">The {type} looks good :))</p>
	{/if}
{/if}
