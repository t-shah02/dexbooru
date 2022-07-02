<script>
	import Searchbar from './Searchbar.svelte';
	import { homePageQuery, searchMatches } from '../stores';
	import { fade } from 'svelte/transition';
	import { darkmode } from "../stores";
	import {onMount} from "svelte";
	import { darkNavbarColor, darkBodyColor, darkCardColor, lightModeColor} from "../colors.js"


	onMount(() => {
		
		
		if ($darkmode) {
			const navbarItems = document.querySelectorAll(".navbar-item");
			for (const item of navbarItems) {
				item.style.color = lightModeColor;
			}
		}	
	
	});	


	export let auth;
	export let username;
	export let email;
	export let tags;
	

	const dexbooruLogoURL = "https://ik.imagekit.io/hhqleju8jy/assets/dexbooru_logo_IorMOo4Cj.png";


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
		if ($darkmode) {
			navMenu.style.backgroundColor = darkNavbarColor;
		}
		else {
			navMenu.style.backgroundColor = lightModeColor;
		}
	}

	function navItemHoverIn(e) {
		if ($darkmode) {
			if (e.target.nodeName === "I") {
				e.target.parentNode.style.backgroundColor = "#424549";
			}
			else {
				e.target.style.backgroundColor = "#424549";
			}
		}
		else {
			if (e.target.nodeName === "I") {
				e.target.parentNode.style.backgroundColor = "#d3d3d3";
			}
			else {
				e.target.style.backgroundColor = "#d3d3d3";	
			}
		}
	}
	
	function navItemHoverOut(e) {
		e.target.style.backgroundColor = "inherit";
	}

	function toggleDarkMode() {
		localStorage.setItem("darkmode",JSON.stringify(!$darkmode));
		darkmode.set(!$darkmode);
	}
	
	

</script>

<nav class="navbar is-fixed-top" style= "background-color : {$darkmode ? darkNavbarColor : lightModeColor}" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
		<div style="display: flex">
			<a class="navbar-item" href="/"
				><img class="logo" src={dexbooruLogoURL} alt="logo" /></a
			>
			<h1 style="color : {$darkmode ? "red" : "green"}" class="app-title navbar-item">Dexbooru</h1>
			<a on:click={toggleDarkMode} class="navbar-item"><i style="color : {$darkmode ? "yellow" : "lightblue"}" class="darkmode-icon {$darkmode ? "fa-solid fa-sun" : "fa-solid fa-moon"}"></i></a>
		</div>
		<a
			role="button"
			on:click={toggleHamburgerMenu}
			class="navbar-burger"
			aria-label="menu"
			aria-expanded="false"
			data-target="navbarBasicExample" 
			style="color : {$darkmode ? "white" : "black"}"
		>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</a>
	</div>

	<div id="menu" class="navbar-menu" style="background-color : {$darkmode ? darkNavbarColor : lightModeColor}">
		<div class="navbar-start">
			<a href="/" class="navbar-item" style= "color : {$darkmode ? lightModeColor: darkNavbarColor}" on:mouseenter={navItemHoverIn} on:mouseleave={navItemHoverOut}>
				<i class="fa-solid fa-house" />
				Home
			</a>

			{#if auth}
				<a href="/upload" class="navbar-item" style= "color : {$darkmode ? lightModeColor: darkNavbarColor}" on:mouseenter={navItemHoverIn} on:mouseleave={navItemHoverOut}> 
					<i class="fa-solid fa-upload"></i>
					Upload 
				</a>
			{/if}

			{#if auth}
				<div id="nav-dropdown" class="navbar-item has-dropdown is-hoverable">
					<a class="navbar-link" style= "color : {$darkmode ? lightModeColor: darkNavbarColor}" on:mouseenter={navItemHoverIn} on:mouseleave={navItemHoverOut}>
						<i class="fa-solid fa-id-badge"></i>
						Welcome back, {username}
					</a>

					<div class="navbar-dropdown is-boxed" style="background-color : {$darkmode ? darkNavbarColor : lightModeColor}">
						<a style= "color : {$darkmode ? lightModeColor: darkNavbarColor}" href="/profile" class="navbar-item" on:mouseenter={navItemHoverIn} on:mouseleave={navItemHoverOut}>
							<i class="fa-solid fa-user"></i>
							 Profile 
						</a>
						<a style= "color : {$darkmode ? lightModeColor: darkNavbarColor}" href="/settings" class="navbar-item" on:mouseenter={navItemHoverIn} on:mouseleave={navItemHoverOut}>
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
			{#if !auth}
				<div class="navbar-item">
					<div class="buttons">
						<a href="/signup" class="button is-danger" style= "color : {$darkmode ? lightModeColor: darkNavbarColor}">
							<i class="fa-solid fa-user-plus" />
							Sign up
						</a>
						<a href="/login" class="button is-primary" style= "color : {$darkmode ? lightModeColor: darkNavbarColor}">
							<i class="fa-solid fa-right-to-bracket" />
							Log in
						</a>
						
					</div>
				</div>
			{/if}
		</div>

		<div class="navbar-end">
			<a on:click={redirectToRandomPost} class="navbar-item" style= "color : {$darkmode ? lightModeColor: darkNavbarColor}" on:mouseenter={navItemHoverIn} on:mouseleave={navItemHoverOut}>
				<i class="fa-solid fa-shuffle"></i>
				Random
			</a>
			<div class="search-area navbar-item">
				<Searchbar {tags} />
				{#if $homePageQuery.length}
					<div in:fade out:fade class="results" style="background-color : {$darkmode ? darkCardColor : lightModeColor} display: {$searchMatches.length ? "none" : "block"}">
						{#each $searchMatches as match}
							<h4 style= "color : {$darkmode ? lightModeColor: darkNavbarColor}">{match}</h4>
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

	.darkmode-icon {
		transform : scale(1.5);
	}

	@media only screen and (min-width: 1024px) {
		.results {
			width: 100%;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			border: 1px solid;
			box-shadow: 1px 3px #888888;
		}

		.results h4 {
			margin: auto;
			cursor: pointer;
			width: 100%;
			font-size: 16px;
			transition: all 150ms ease-in-out;
		}

		.results h4:hover {
			background-color: #888888;
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
			font-size: 16px;
			transition : background-color 200ms ease-in-out;
			z-index: 1000;
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
			margin-top: 5px;
			margin-bottom: 5px;
		}

		.navbar.is-fixed-top {
			height: 60px;
		}
	}

	@media only screen and (max-width: 1023px) {
		

		.results {
			width: 100%;
			max-width: 254px;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			border: 1px solid;
			box-shadow: 1px 3px #888888;
		}

		.results h4 {
			margin: auto;
			cursor: pointer;
			width: 100%;
			font-size: 16px;
			transition: all 150ms ease-in-out;
		}

		.results h4:hover {
			background-color: #888888;
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
			font-size: 16px;
			transition : background-color 200ms ease-in-out;
			z-index: 1000;
			overflow-y: scroll;	
		}

		.navbar-brand {
			margin-left: 20px;
		}

		.navbar-start {
			margin-left: 30px;
		}

		.navbar-burger {
			width: 50px;
		}

		a {
			text-decoration: none;
			display:table;
			width:25%;
		}

		.button {
			margin-left:0;
			margin-right:auto;
			margin-top: 2px;
			margin-bottom: 5px;
			
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

		.navbar-end {
			margin-left:30px;
		}

		.buttons {
			display : block;
		}

	}

	.logo {
		transform: scale(2);
		transition: transform 200ms ease-in-out;
	}

	.logo:hover {
		cursor: pointer;
		transform: scale(2.1);
	}

	h4 {
		padding-left: 2.5%;
	}

</style>
