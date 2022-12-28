<script lang="ts">
	import type { Post } from '@prisma/client';

	export let sameUser: boolean;
	export let posts: Post[];
</script>

<div>
	<div class="tabs">
		<a href="#posts" data-ui="#user-posts" class="active">
			<i>description</i>
			<span>Posts</span>
		</a>

		{#if sameUser}
			<a href="#history" data-ui="#user-history">
				<i>history</i>
				<span>History</span>
			</a>
			<a href="#settings" data-ui="#user-settings">
				<i>settings</i>
				<span>Settings</span>
			</a>
		{/if}
	</div>
	<div id="user-posts" class="page padding active">
		<h5>Tab 1</h5>
	</div>

	{#if sameUser}
		<div id="user-history" class="page padding">
			<h5>Tab 2</h5>
		</div>
		<div id="user-settings" class="page padding">
			<h5>Tab 3 blah blah</h5>
		</div>
	{/if}
</div>

<style>
	div {
		width: 100%;
		margin-top: 20px;
	}
</style>
