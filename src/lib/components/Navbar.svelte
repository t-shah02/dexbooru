<script lang="ts">
	import logo from '$lib/assets/logo.ico';
	import type { AutoCompleteResponse } from '$lib/interfaces/queries';
	import { slide } from 'svelte/transition';
	export let user: any = null;
	const emptyAutoCompleteResponse: AutoCompleteResponse = { tags: [], artists: [], users: [] };
	const queryMap = new Map<string, AutoCompleteResponse>();
	let query = '';
	let searchSuggestions: AutoCompleteResponse = emptyAutoCompleteResponse;
	let previousSearchSuggestions: AutoCompleteResponse = emptyAutoCompleteResponse;
	let debouncing = false;
	const emptySuggestions = (suggestions: AutoCompleteResponse) =>
		!suggestions.tags.length && !suggestions.artists.length && !suggestions.users.length;
	const focusOnSearchBar = () => {
		searchSuggestions = previousSearchSuggestions;
	};
	const focusOffSearchBar = () => {
		previousSearchSuggestions = searchSuggestions;
		searchSuggestions = emptyAutoCompleteResponse;
	};
	async function callAutoCompleteAPI(): Promise<AutoCompleteResponse> {
		if (!query) return emptyAutoCompleteResponse;
		if (queryMap.has(query)) {
			return queryMap.get(query) || { tags: [], artists: [], users: [] };
		}
		const response = await fetch(`/api/autocomplete?q=${query}`);
		const suggestions: AutoCompleteResponse = await response.json();
		return suggestions;
	}
	async function updateSearchSuggestions() {
		if (!query) {
			searchSuggestions = emptyAutoCompleteResponse;
			return;
		}
		if (debouncing) return;
		debouncing = true;
		searchSuggestions = await callAutoCompleteAPI();
		queryMap.set(query, searchSuggestions);
		const queryPreDebounce = query;
		setTimeout(async () => {
			debouncing = false;
			if (!query) {
				searchSuggestions = emptyAutoCompleteResponse;
				return;
			}
			if (query === queryPreDebounce) {
				return;
			}
			searchSuggestions = await callAutoCompleteAPI();
		}, 750);
	}
	let y = 0
</script>

<svelte:window bind:innerWidth={y}/>

<header>
	<nav>
		<button data-ui="#left-menu-bar" class="circle transparent">
			<i>menu</i>
		</button>
		<h5 class="center-align">DEXBOORU</h5>
		<button class="circle transparent">
			<img class="responsive" src={logo} alt="dexbooru navbar logo" />
		</button>
		{#if y >= 600}
		<div class="max" />
		<div class="field label prefix suffix border">
			<i>search</i>
			<input
				bind:value={query}
				on:input={updateSearchSuggestions}
				on:focusin={focusOnSearchBar}
				on:focusout={focusOffSearchBar}
				class="search-bar"
				type="text"
				placeholder="Find artists, tags, users"
			/>
			{#if !emptySuggestions(searchSuggestions)}
				<div in:slide out:slide class="autocomplete-results">
					{#if searchSuggestions.tags.length}
						<div class="search-header">
							<i>tag</i>
							<h5 class="search-heading">Tags</h5>
						</div>
						<div class="search-section">
							{#each searchSuggestions.tags as tag}
								<h6>{tag}</h6>
							{/each}
						</div>
					{/if}

					{#if searchSuggestions.artists.length}
						<div class="search-header">
							<i>palette</i>
							<h5 class="search-heading">Artists</h5>
						</div>
						<div class="search-section">
							{#each searchSuggestions.artists as artist}
								<h6>{artist}</h6>
							{/each}
						</div>
					{/if}

					{#if searchSuggestions.users.length}
						<div class="search-header">
							<i>person</i>
							<h5 class="search-heading">Users</h5>
						</div>
						<div class="search-section">
							{#each searchSuggestions.users as user}
								<div class="user-suggestion">
									<img
										style="margin-right : 5px;"
										class="circle tiny"
										src={user.profilePictureUrl}
										alt="profile picture for {user.username}"
									/>
									<h6>{user.username}</h6>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
		{/if}
	</nav>
</header>

<div id="left-menu-bar" class="modal left">
	<header class="fixed">
		<nav>
			<button data-ui="#left-menu-bar" class="transparent circle">
				<i>close</i>
			</button>
			<h5 class="max">Menu</h5>
		</nav>
	</header>
	<a data-sveltekit-reload href="/" class="row round">
		<i>home </i>
		<span>Home</span>
	</a>
	{#if y < 600}
	<div class="max" />
	<div class="field label prefix suffix border" style={"margin-left: 20px"}>
		<i>search</i>
		<input
			bind:value={query}
			on:input={updateSearchSuggestions}
			on:focusin={focusOnSearchBar}
			on:focusout={focusOffSearchBar}
			class="search-bar"
			type="text"
			placeholder="Find artists, tags, users"
		/>
		{#if !emptySuggestions(searchSuggestions)}
			<div in:slide out:slide class="autocomplete-results">
				{#if searchSuggestions.tags.length}
					<div class="search-header">
						<i>tag</i>
						<h5 class="search-heading">Tags</h5>
					</div>
					<div class="search-section">
						{#each searchSuggestions.tags as tag}
							<h6>{tag}</h6>
						{/each}
					</div>
				{/if}

				{#if searchSuggestions.artists.length}
					<div class="search-header">
						<i>palette</i>
						<h5 class="search-heading">Artists</h5>
					</div>
					<div class="search-section">
						{#each searchSuggestions.artists as artist}
							<h6>{artist}</h6>
						{/each}
					</div>
				{/if}

				{#if searchSuggestions.users.length}
					<div class="search-header">
						<i>person</i>
						<h5 class="search-heading">Users</h5>
					</div>
					<div class="search-section">
						{#each searchSuggestions.users as user}
							<div class="user-suggestion">
								<img
									style="margin-right : 5px;"
									class="circle tiny"
									src={user.profilePictureUrl}
									alt="profile picture for {user.username}"
								/>
								<h6>{user.username}</h6>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
	{/if}
	<a href="/tags" class="row round">
		<i>tag </i>
		<span>Tags</span>
	</a>

	<a href="/artists" class="row round">
		<i>palette</i>
		<span>Artists</span>
	</a>

	{#if !user}
		<a href="/auth/signup" class="row round">
			<i>person_add</i>
			<span>Sign up</span>
		</a>
		<a href="/auth/login" class="row round">
			<i>login</i>
			<span>Log in</span>
		</a>
	{:else}
		<div class="small-divider" />
		<div class="row">Signed in as {user.username}</div>
		<a href="/profile/{user.username}" class="row round">
			<img
				class="circle"
				src={user.profilePictureUrl}
				alt="menu bar profile picture for {user.username}"
			/>
			<span>Profile</span>
		</a>
		<a href="/auth/signout" class="row round">
			<i>logout</i>
			<span>Sign out</span>
		</a>
	{/if}
</div>

<style>
	#left-menu-bar {
		background-color: #f0f3f5;
	}
	nav {
		background-color: #f0f3f5;
	}
	img {
		object-fit: cover;
		margin: 5.5px;
	}
	header {
		margin: 0;
		padding: 0;
	}
	.autocomplete-results {
		text-align: center;
		background-color: white;
		box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
		z-index: 1200;
		transition: height 200ms ease-in-out;
	}
	h6 {
		font-size: 15px;
	}
	h5 {
		font-size: 17px;
	}
	.user-suggestion {
		display: flex;
		margin-top: 5px;
	}
	.search-section {
		margin-left: 20px;
	}
	.search-header {
		margin-left: 7.5px;
		margin-top: 5px;
		display: flex;
		align-items: center;
	}
	.label {
		right: 20px;
	}
</style>