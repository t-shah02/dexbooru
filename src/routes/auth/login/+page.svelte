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
	<form method="POST">
		<Textfield
			input$name="username"
			type="text"
			style="margin : 10px;"
			class="shaped-outlined"
			variant="outlined"
			bind:value={username}
			label="Enter your username"
		/>
		<Textfield
			input$name="password"
			type="password"
			style="margin : 10px"
			class="shaped-outlined"
			variant="outlined"
			bind:value={password}
			label="Enter your password"
		/>

		<Button
			style="width : 50%; display : block; margin-left : auto; margin-right : auto; margin-top : 5px;"
			variant="raised"
		>
			<Label>Login</Label>
		</Button>
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
</style>
