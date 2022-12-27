<script lang="ts">
	import type { ActionData } from './$types';
	import { isStrongPassword, isValidEmail, isValidUsername } from '$lib/auth/helpers';
	import { getImageEncoding, getFileSizeInMB } from '$lib/images/parsing';
	import { MAXIMUM_IMAGE_SIZE_MB } from '$lib/images/imageConstants';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { ACCEPTED_IMAGE_FORMATS } from '$lib/images/imageConstants';

	export let form: ActionData;

	let email = '';
	let username = '';
	let password = '';
	let confirmedPassword = '';
	let profilePictureEncoding: string | ArrayBuffer | null = '';
	let uploadedFileName: string | null = '';
	let fileTooBig = false;

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
			emailMessage = 'Looks good!';
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
			passwordsMatchingMessage = 'The passwords need to match';
		} else {
			passwordsMatchingMessage = 'The passwords match';
		}
	};

	const profilePictureChange = async (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		const file: File | null = target.files ? target.files[0] : null;

		if (file) {
			const fileSize = getFileSizeInMB(file);
			if (fileSize > MAXIMUM_IMAGE_SIZE_MB) {
				fileTooBig = true;
				setTimeout(() => {
					fileTooBig = false;
					removeProfilePicture();
				}, 3000);
				return;
			}
			uploadedFileName = file.name;
			profilePictureEncoding = await getImageEncoding(file);
		}
	};

	const removeProfilePicture = () => {
		profilePictureEncoding = '';
		const fileSelector = document.querySelector('#file-selector') as HTMLInputElement;
		fileSelector.value = '';
	};
	
</script>

<div class="signup-form-ctn">
	<h1 class="form-title">Signup for Dexbooru</h1>
	<form method="POST" enctype="multipart/form-data" autocomplete="off">
		<div>
			<div class="field label border">
				<input on:input={emailOnType} bind:value={email} name="email" type="text" />
				<label for="email">Enter your email</label>
				<span class="helper">{emailMessage}</span>
			</div>
			<div class="field label border">
				<input on:input={userNameOnType} bind:value={username} name="username" type="text" />
				<label for="username">Enter your username</label>
			</div>

			<article>
				<details>
					<summary class="none">
						<div class="row">
							<i class="large fill">account_circle</i>
							<div class="max">
								<h5>Requirements</h5>
							</div>
							<i>arrow_drop_down</i>
						</div>
					</summary>
					{#each satisfiedUserNameRequirements as requirement}
						<p class="satisfied">{requirement}</p>
					{/each}

					{#each unsatisfiedUserNameRequirements as requirement}
						<p class="unsatisfied">{requirement}</p>
					{/each}
				</details>
			</article>
			<div style="margin-top : 20px" class="field label prefix border">
				<i>image</i>
				<input type="text" />
				<input
					id="file-selector"
					on:change={profilePictureChange}
					name="profilePicture"
					type="file"
					accept={ACCEPTED_IMAGE_FORMATS}
				/>
				<label for="profilePicture">Choose your profile picture</label>
			</div>
			{#if profilePictureEncoding}
				<div class="profile-preview">
					<img
						class="form-img small-width small-height"
						src={profilePictureEncoding?.toString()}
						alt="selected profile"
					/>
					<div class="icon-row">
						<a on:click={removeProfilePicture} class="chip circle">
							<i>cancel</i>
							<div class="tooltip top">Remove</div>
						</a>
						<a data-ui="#preview-modal" class="chip circle">
							<i>preview</i>
							<div class="tooltip top">Preview full image</div>
						</a>
						<div class="modal" id="preview-modal">
							<h5>Preview of: {uploadedFileName}</h5>
							<img src={profilePictureEncoding.toString()} alt="preview of {uploadedFileName}" />
							<nav>
								<button style="margin-top : 0" type="button" data-ui="#preview-modal">Close</button>
							</nav>
						</div>
					</div>
				</div>
			{/if}
		</div>
		<div>
			<div class="field label border">
				<input on:input={passwordOnType} bind:value={password} name="password" type="password" />
				<label for="password">Enter your password</label>
			</div>

			<article>
				<details>
					<summary class="none">
						<div class="row">
							<i class="large fill">lock</i>
							<div class="max">
								<h5>Requirements</h5>
							</div>
							<i>arrow_drop_down</i>
						</div>
					</summary>
					{#each satisfiedPasswordRequirements as requirement}
						<p class="satisfied">{requirement}</p>
					{/each}

					{#each unsatisfiedPasswordRequirements as requirement}
						<p class="unsatisfied">{requirement}</p>
					{/each}
				</details>
			</article>
			<div class="field label border">
				<input
					on:input={passwordMatchOnType}
					bind:value={confirmedPassword}
					name="confirmedPassword"
					type="password"
				/>
				<label for="confirmedPassword">Renter your password</label>
				<span class="unsatisfied">{passwordsMatchingMessage}</span>
			</div>
		</div>

		{#if form}
			<h6 class="error-msg">{form?.error}</h6>
		{/if}

		<button class="tertiary large-elevate">
			<i>person_add</i>
			<span>Sign up</span>
		</button>

		<div class="toast red white-text {fileTooBig ? 'active' : ''}">
			<i>error</i>
			<span>The maximum file size that can be uploaded is {MAXIMUM_IMAGE_SIZE_MB} MB.</span>
		</div>
	</form>
</div>

<style>
	.profile-preview {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	.chip {
		margin: 10px;
	}

	.icon-row {
		display: flex;
		flex-direction: column;
	}

	.form-img {
		display: block;
		border-radius: 50%;
		object-fit: cover;
		object-position: top;
		transition: object-position 500ms ease-in-out;
	}

	.form-img:hover {
		object-position: bottom;
	}

	div {
		margin: 5px;
	}

	.form-title {
		text-align: center;
		font-weight: bold;
		font-size: 20px;
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
		margin-top: 10px;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 120px;
		width: 50%;
		max-width: 500px;
	}

	article {
		margin-top: 0;
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

	.field {
		margin: 10px;
	}

	.tertiary {
		margin-top: 10px;
	}

	@media only screen and (max-width: 60em) {
		.signup-form-ctn {
			width: 80%;
		}
	}
</style>
