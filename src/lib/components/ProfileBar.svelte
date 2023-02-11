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
			<form method="POST" action="?/email">
				<label for="email">New email</label>
				<input name="email" type="email" placeholder="Enter a new email" />
				<label for="emailConfirm">Confirm new email</label>
				<input name="emailConfirm" type="email" placeholder="Confirm new email" />
				<button class="button">Change email</button>
			</form>

			<form method="POST" action="?/password">
				<label for="oldPassword">Old password</label>
				<input name="oldPassword" type="password" placeholder="Enter your old password" />
				<label for="newPassword">New password</label>
				<input name="newPassword" type="password" placeholder="Enter a new password" />
				<label for="newPasswordConfirm">Confirm new password</label>
				<input name="newPasswordConfirm" type="password" placeholder="Confirm new password" />
				<button class="button">Change password</button>
			</form>

			<form method="POST" action="?/username">
				<label for="username">New username</label>
				<input name="username" type="text" placeholder="Enter a new username" />
				<label for="username_confirm">Confirm new username</label>
				<input name="username_confirm" type="text" placeholder="Confirm new username" />
				<button class="button">Change username</button>
			</form>
		</div>
	{/if}
</div>

<style>
	div {
		width: 100%;
		margin-top: 20px;
	}
</style>
