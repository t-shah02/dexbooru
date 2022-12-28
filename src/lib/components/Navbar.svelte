<script lang="ts">
	import logo from '$lib/assets/logo.ico';

	export let user: any = null;
</script>

<header>
	<nav>
		<button data-ui="#left-menu-bar" class="circle transparent">
			<i>menu</i>
		</button>
		<h5 class="center-align">DEXBOORU</h5>
		<button class="circle transparent">
			<img class="responsive" src={logo} alt="dexbooru navbar logo" />
		</button>
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
	<a href="/posts" class="row round">
		<i>description </i>
		<span>Posts</span>
	</a>
	<a href="/search" class="row round">
		<i>search</i>
		<span>Search</span>
	</a>
	<a href="/tags" class="row round">
		<i>tag </i>
		<span>Tags</span>
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
	img {
		object-fit: cover;
	}

	header {
		margin: 0;
		padding: 0;
	}
</style>
