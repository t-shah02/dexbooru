<script>
	import Searchbar from './Searchbar.svelte';
	import { homePageQuery, searchMatches } from '../stores';
	import { fade } from 'svelte/transition';
	import { goto } from "$app/navigation";

	export let auth;
	export let username;
	export let email;
	export let tags;

	async function logOut() {
		const requestBody = { email: email };
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			body: JSON.stringify(requestBody)
		});

		if (response.status == 200) {
			window.location.replace('/');
		}
	}

	async function redirectToRandomPost() {
		const response = await fetch("/api/random");
		const {randomPostID} = await response.json();
		const redirectURL = `/posts/${randomPostID}`
		window.location.replace(redirectURL);
	}

	function toggleHamburgerMenu(e) {
		e.target.classList.toggle('is-active');
		const navMenu = document.querySelector('#menu');
		navMenu.classList.toggle('is-active');
	}
</script>

<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href="/"
			><img class="logo" src="/images/dexbooru_logo.png" alt="logo" /></a
		>
		<h1 class="app-title navbar-item">Dexbooru</h1>
		<a
			role="button"
			on:click={toggleHamburgerMenu}
			class="navbar-burger"
			aria-label="menu"
			aria-expanded="false"
			data-target="navbarBasicExample"
		>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</a>
	</div>

	<div id="menu" class="navbar-menu">
		<div class="navbar-start">
			<a href="/" class="navbar-item">
				<i class="fa-solid fa-house" />
				Home
			</a>

			{#if auth}
				<a href="/upload" class="navbar-item"> 
					<i class="fa-solid fa-upload"></i>
					Upload 
				</a>
			{/if}

			{#if auth}
				<div class="navbar-item has-dropdown is-hoverable">
					<a class="navbar-link">
						<i class="fa-solid fa-id-badge"></i>
						Welcome back, {username}
					</a>

					<div class="navbar-dropdown is-boxed">
						<a href="/profile" class="navbar-item">
							<i class="fa-solid fa-user"></i>
							 Profile 
						</a>
						<a href="/settings" class="navbar-item"> 
							<i class="fa-solid fa-gear"></i>
							Settings
						 </a>
						<hr class="navbar-divider" />
						<button on:click={logOut} class="button is-danger">
							<i class="fa-solid fa-arrow-right-from-bracket" />
							Log out
						</button>
					</div>
				</div>
			{/if}
			
		</div>

		<div class="navbar-end">
			<a on:click={redirectToRandomPost} class="navbar-item">
				<i class="fa-solid fa-shuffle"></i>
				Random
			</a>
			{#if !auth}
				<div class="navbar-item">
					<div class="buttons">
						<a href="/signup" class="button is-danger">
							<i class="fa-solid fa-user-plus" />
							Sign up
						</a>
						<a href="/login" class="button is-primary">
							<i class="fa-solid fa-right-to-bracket" />
							Log in
						</a>
					</div>
				</div>
			{/if}
			<div class="search-area navbar-item">
				<Searchbar {tags} />
				{#if $homePageQuery.length}
					<div in:fade out:fade class="results">
						{#each $searchMatches as match}
							<h1>{match}</h1>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>

<style>
	.app-title {
		font-size: 20px;
		color: rgb(0, 162, 0);
	}

	@media only screen and (min-width: 1024px) {
		.results {
			background-color: black;
			width: 100%;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
		}

		.logo {
			transform: scale(2);
			transition: transform 200ms ease-in-out;
		}

		.logo:hover {
			cursor: pointer;
			transform: scale(2.1);
		}

		.results h1 {
			margin: auto;
			text-align: center;
			color: white;
			cursor: pointer;
			width: 100%;
			font-size: 20px;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			transition: all 150ms ease-in-out;
		}

		.results h1:hover {
			background-color: red;
		}

		.search-area.navbar-item {
			display: flex;
			flex-direction: column;
		}

		i {
			padding-left: 8px;
			padding-right: 8px;
		}

		.navbar {
			font-size: 20px;
		
		}

		.navbar-brand {
			margin-left: 20px;
		}

		.navbar-start {
			margin-left: 30px;
		}

		a {
			text-decoration: none;
		}

		.button {
			display: block;
			margin-left: auto;
			margin-right: auto;
		}

		.navbar.is-fixed-top {
			height: 60px;
		}
	}

	@media only screen and (max-width: 1024px) {
		.results {
			background-color: blue;
			width: 100%;
			max-width: 254px;
		}

		.results h1 {
			text-align: center;
		}

		.search-area.navbar-item {
			display: flex;
			flex-direction: column;
			width: 50%;
		}

		i {
			padding-left: 8px;
			padding-right: 8px;
		}

		.navbar {
			font-size: 20px;
		}

		.navbar-brand {
			margin-left: 20px;
		}

		.navbar-start {
			margin-left: 30px;
		}

		a {
			text-decoration: none;
		}

		.button {
			display: block;
			margin-left: 0;
			margin-right: auto;
		}

		.navbar.is-fixed-top {
			height: 60px;
		}

		.navbar-link:not(.is-arrowless)::after {
			border-color: transparent;
			border: none;
			margin-top: -0.375em;
			right: 1.125em;
		}
	}

	/* ul {
        display : flex;
        flex-wrap : wrap;
        justify-content: center;
        list-style-type: none;
    }

    li {
        border : 1px solid;
        border-radius : 7px;
        padding : 10px;
        margin : 10px;
        transition : all 300ms;
    }

    li:hover {
        background-color : lightblue;
        color : white;
    } */
</style>
