<script lang="ts">
	import logo from '$lib/assets/logo.ico';
	export let user = null;
	import Button, { Label } from '@smui/button';
</script>

<nav class="navbar" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="app-title navbar-item" href="/">
			<img class="navbar-logo" src={logo} />
			DEXBOORU
		</a>
		<a
			role="button"
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

	<div id="navbarBasicExample" class="navbar-menu">
		<div class="navbar-start">
			<a href="/" class="navbar-item"> Home </a>
			<a href="/about" class="navbar-item"> About </a>
		</div>

		<div class="navbar-end">
			{#if user}
				<Button
					data-hystmodal="#upload-modal"
					class="upload-btn"
					style="width : 50%; display : block; margin-left : auto; margin-right : auto; margin-top : 15px; margin-bottom : 10px; background-color: green;"
					variant="raised"
				>
					<Label>Upload</Label>
				</Button>


				<div id="user-dropdown" class="navbar-item has-dropdown is-hoverable">
					<a class="navbar-link"> Welcome back, {user.username} </a>

					<div class="navbar-dropdown is-boxed">
						<a href="/auth/profile" class="navbar-item"> Profile </a>
						<a href="/auth/settings" class="navbar-item"> Settings </a>
						<hr class="navbar-divider" />
						<a href="/auth/signout" class="navbar-item"> Sign out </a>
					</div>
				</div>
			{:else}
				<div class="navbar-item">
					<div class="buttons">
						<a href="/auth/signup" class="button is-primary"> Sign up </a>
						<a href="/auth/login" class="button is-danger"> Log in </a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</nav>

<style>
	#user-dropdown {
		margin-right: 7.5px;
	}

	.app-title {
		font-size: 20px;
		font-weight: bold;
	}

	.navbar-logo {
		transform: scale(1.3);
		margin-right: 9px;
	}
</style>
