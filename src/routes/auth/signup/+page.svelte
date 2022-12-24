<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Button, { Label } from '@smui/button';
	import type { Action, ActionData } from './$types';
	import { isStrongPassword, isValidEmail, isValidUsername } from '$lib/auth/helpers';

	export let form: ActionData;

	let email = '';
	let username = '';
	let password = '';
	let confirmedPassword = '';

	//vars to store error messages
	let emailMessage = '';
	let passwordsMatchingMessage = '';
	let satisfiedPasswordRequirements: string[] = [];
	let unsatisfiedPasswordRequirements: string[] = [];
	let satisfiedUserNameRequirements: string[] = [];
	let unsatisfiedUserNameRequirements: string[] = [];

	const emailOnType = () => {
		const result = isValidEmail(email);
		if (result) {
			emailMessage = '';
		} else {
			emailMessage = 'Please enter a valid email address';
		}
	};

	const passwordOnType = () => {
		const result = isStrongPassword(password);

		if (typeof result === 'boolean') {
			satisfiedPasswordRequirements = [];
			unsatisfiedPasswordRequirements = [];
		} else {
			const [satisified, unsatisifed] = result;
			satisfiedPasswordRequirements = satisified;
			unsatisfiedPasswordRequirements = unsatisifed;
		}
	};
	const userNameOnType = () => {
		const result = isValidUsername(username);

		if (typeof result === 'boolean') {
			satisfiedUserNameRequirements = [];
			unsatisfiedUserNameRequirements = [];
		} else {
			const [satisified, unsatisifed] = result;
			satisfiedUserNameRequirements = satisified;
			unsatisfiedUserNameRequirements = unsatisifed;
		}
	};

	const passwordMatchOnType = () => {
		if (confirmedPassword !== password) {
			passwordsMatchingMessage = 'Passwords need to match';
		} else {
			passwordsMatchingMessage = '';
		}
	};
</script>

<div class="signup-form-ctn">
	<h1 class="form-title">Signup for Dexbooru</h1>
	<form method="POST">
		<Textfield
			input$name="email"
			type="email"
			style="margin : 10px;"
			class="shaped-outlined"
			variant="outlined"
			bind:value={email}
			on:input={emailOnType}
			label="Enter your email"
		/>
		{#if emailMessage !== ''}
			<p class="unsatisfied">{emailMessage}</p>
		{/if}

		<Textfield
			input$name="username"
			type="text"
			style="margin : 10px;"
			class="shaped-outlined"
			variant="outlined"
			bind:value={username}
			on:input={userNameOnType}
			label="Enter your username"
		/>
		{#each satisfiedUserNameRequirements as requirement}
			<p class="satisfied">{requirement}</p>
		{/each}

		{#each unsatisfiedUserNameRequirements as requirement}
			<p class="unsatisfied">{requirement}</p>
		{/each}

		<Textfield
			input$name="password"
			type="password"
			style="margin : 10px"
			class="shaped-outlined"
			variant="outlined"
			bind:value={password}
			on:input={passwordOnType}
			label="Enter your password"
		/>
		{#each satisfiedPasswordRequirements as requirement}
			<p class="satisfied">{requirement}</p>
		{/each}

		{#each unsatisfiedPasswordRequirements as requirement}
			<p class="unsatisfied">{requirement}</p>
		{/each}

		<Textfield
			input$name="confirmedPassword"
			type="password"
			style="margin : 10px"
			class="shaped-outlined"
			variant="outlined"
			bind:value={confirmedPassword}
			on:input={passwordMatchOnType}
			label="Confirm your password"
		/>
		{#if passwordsMatchingMessage !== ''}
			<p class="unsatisfied">{passwordsMatchingMessage}</p>
		{/if}

		{#if form}
			<h2 class="error">{form?.error}</h2>
		{/if}

		{#if (emailMessage == "") && (passwordsMatchingMessage == "") && (satisfiedPasswordRequirements.length == 0)
		&& (unsatisfiedPasswordRequirements.length == 0) && (satisfiedUserNameRequirements.length == 0) && (unsatisfiedUserNameRequirements.length == 0)
		&& (email != "") && (password != "") && (username != "") && (password == confirmedPassword)}
		<Button
			style="width : 50%; display : block; margin-left : auto; margin-right : auto; margin-top : 15px; margin-bottom : 10px;"
			variant="raised"
		>
			<Label>Sign up</Label>
		</Button>
		{/if}
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

	.signup-form-ctn {
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		padding: 10px;
		border-radius: 10px;
		margin-top: 5%;
		margin-bottom: 100px;
		margin-left: auto;
		margin-right: auto;
		width: 50%;
		max-width: 500px;
	}

	.satisfied {
		color: green;
		font-size: 12px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		text-align: left;
	}

	.unsatisfied {
		color: red;
		font-size: 12px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		text-align: left;
	}

	@media only screen and (max-width: 60em) {
		.signup-form-ctn {
			width: 80%;
		}
	}
</style>
