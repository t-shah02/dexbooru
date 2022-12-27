<script lang="ts">
	import logo from '$lib/assets/logo.ico';

	export let user: any = null;
</script>

<nav class="right-align">
	<a href="/">
		<img class="circle" src={logo} alt="dexbooru logo" />
	</a>
	<a href="/">
		<button>
			<i>home</i>
			<span>Home</span>
		</button>
	</a>
	<a href="/search">
		<button>
			<i>search</i>
			<span>Search</span>
		</button>
	</a>

	<div class="max" />

	{#if user}
		<a href={`/profile/${user.username}`}>
			<button>
				<img alt={`logo for ${user.username}`} class="circle small" src={user.profilePictureUrl} />
				<span>Profile</span>
			</button>
		</a>
		<a href="/auth/signout">
			<button>
				<i>logout</i>
				<span>Sign out</span>
			</button>
		</a>
	{:else}
		<a href="/auth/signup">
			<button>
				<i>person_add</i>
				<span>Sign up</span>
			</button>
		</a>
		<a href="/auth/login">
			<button>
				<i>login</i>
				<span>Log in</span>
			</button>
		</a>
	{/if}
</nav>

<style>
	nav {
		background-color: lightyellow;
	}

	button {
		margin-right: 1px;
		margin-left: 1px;
	}
</style>
