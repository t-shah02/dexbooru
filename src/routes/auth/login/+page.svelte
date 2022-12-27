<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Button, { Label } from '@smui/button';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let username = '';
	let password = '';
</script>

<div class="login-form-ctn">
	<h1 class="form-title">Login to Dexbooru</h1>
	<form method="POST" autocomplete="off">
		<div class="field label border">
			<input bind:value={username} name="username" type="text" />
			<label for="username">Enter your username</label>
		</div>

		<div class="field label border">
			<input bind:value={password} name="password" type="password" />
			<label for="password">Enter your password</label>
		</div>

		{#if form}
			<h6 class="error-msg">{form?.error}</h6>
		{/if}

		<button class="tertiary large-elevate">
			<i>login</i>
			<span>Log in</span>
		</button>
	</form>
</div>

<style>
	.form-title {
		text-align: center;
		font-weight: bold;
		font-size: 20px;
		margin-bottom: 10px;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.login-form-ctn {
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		padding: 10px;
		border-radius: 10px;
		margin-top: 150px;
		margin-left: auto;
		margin-right: auto;
		width: 35%;
	}

	@media only screen and (max-width: 40em) {
		.login-form-ctn {
			width: 80%;
		}
	}

	div {
		margin : 10px;
	}

</style>
