<script context="module">
	export async function load({ session }) {
		const auth = session.authenticated;
		if (auth) {
			const email = session.email;
			const username = session.username;
			const pfp = session.pfp;
			return { props: { email: email, username: username } };
		}
		return { status: 302, redirect: '/' };
	}
</script>

<script>
	import { slide } from 'svelte/transition';
	import { darkmode } from '../stores';
	import {
		darkCardColor,
		darkBodyColor,
		lightModeColor,
		menuSelectedColor,
		lightMenuHoverActiveColor,
		darkMenuHoverActiveColor
	} from '../colors.js';

	export let email;
	export let username;

	//menu state variables
	let mis = true;
	let pfp = false;
	let account_details = false;

	//user state variables
	let newEmail = '';
	let newUsername = '';
	let newPassword1 = '';
	let newPassword2 = '';

	let isEmailValid = true;
	let ispassword1Good = true;
	let passwordHint = '';
	let emptyEmailFields = false;
	let invalidEmailFields = false;
	let duplicatedFields = false;
	let emptyUserNameFields = false;
	let invalidPasswordFields = false;
	let emptyPasswordFields = false;
	let loading = false;

	let fileName = '';

	let previewImageURL = '';
	let pfpImageEncoding = '';

	let profileInput;

	// DOM items for the menu bar
	let misItem;
	let pfpItem;
	let actItem;

	//image files
	function getEncoding(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onloadend = () => {
				resolve(reader.result);
			};

			reader.onerror = reject;
		});
	}

	async function consumeFile(e) {
		let file = e.target.files[0];
		if (file) {
			fileName = file.name;
			const blobURL = URL.createObjectURL(file);
			previewImageURL = blobURL;
			pfpImageEncoding = await getEncoding(file);
		}
	}

	//functions to change state variable
	function toggleMis(e) {
		mis = true;
		pfp = false;
		account_details = false;

		misItem.style.backgroundColor = menuSelectedColor;
		pfpItem.style.backgroundColor = 'inherit';
		actItem.style.backgroundColor = 'inherit';
	}

	function togglePfp(e) {
		mis = false;
		pfp = true;
		account_details = false;

		misItem.style.backgroundColor = 'inherit';
		pfpItem.style.backgroundColor = menuSelectedColor;
		actItem.style.backgroundColor = 'inherit';
	}

	function toggleAct(e) {
		mis = false;
		pfp = false;
		account_details = true;

		misItem.style.backgroundColor = 'inherit';
		pfpItem.style.backgroundColor = 'inherit';
		actItem.style.backgroundColor = menuSelectedColor;
	}

	//functions to check email and password
	function checkEmail() {
		console.log('hello world');
		let validator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		if (validator.test(newEmail)) {
			isEmailValid = true;
		} else {
			isEmailValid = false;
		}
	}

	function cancelProfileUpload() {
		previewImageURL = '';
		fileName = '';
		pfpImageEncoding = '';
		profileInput.value = '';
	}

	function checkPassword() {
		const MIN_PASSWORD_LENGTH = 12;
		const lengthCheck = newPassword1.length >= MIN_PASSWORD_LENGTH;
		const lowercaseCheck = newPassword1.search('[a-z]+');
		const uppercaseCheck = newPassword1.search('[A-Z]+');
		const numberCheck = newPassword1.search('[0-9]+');
		const specialCharCheck = newPassword1.search("[$&+,:;=?@#|'<>.^*()%!-]");

		const failedChecks = [];
		if (lowercaseCheck == -1) {
			failedChecks.push('Please include at least one lowercase character!');
		}
		if (uppercaseCheck == -1) {
			failedChecks.push('Please include at least one uppercase character!');
		}
		if (!lengthCheck) {
			failedChecks.push('Please ensure that password is at least 12 characters');
		}
		if (numberCheck == -1) {
			failedChecks.push('Please include at least one numerical character!');
		}
		if (specialCharCheck == -1) {
			failedChecks.push('Please include at least one special character! Ex: #,$,!,etc..');
		}

		if (failedChecks.length) {
			passwordHint = failedChecks.join(', ');
			ispassword1Good = false;
		} else {
			ispassword1Good = true;
		}
	}

	//functions to apply changed settings
	async function registerUserEmail() {
		if (!isEmailValid) {
			invalidEmailFields = true;
			return;
		}

		if (newEmail.length == 0) {
			emptyEmailFields = true;
			return;
		}

		invalidEmailFields = false;
		emptyEmailFields = false;
		invalidPasswordFields = false;
		emptyPasswordFields = false;
		emptyUserNameFields = false;

		const body = { newEmail, oldEmail : email, operation : "email" };
		loading = true;
		const response = await fetch('/api/auth/update', {
			method: 'PUT',
			body: JSON.stringify(body)
		});
		loading = false;

	}

	async function registerUserName() {
		if (newUsername.length == 0) {
			emptyUserNameFields = true;
			return;
		}

		invalidEmailFields = false;
		emptyEmailFields = false;
		invalidPasswordFields = false;
		emptyPasswordFields = false;
		emptyUserNameFields = false;

		const body = { oldUserName: username, newUsername: newUsername, operation : "username" };
		loading = true;
		const response = await fetch('/api/auth/update', {
			method: 'PUT',
			body: JSON.stringify(body)
		});
		loading = false;
	
	}

	async function registerUserPassword() {
		if (newPassword1.length == 0 || newPassword2.length == 0) {
			emptyPasswordFields = true;
			return;
		}

		if (!ispassword1Good || newPassword1 != newPassword2) {
			invalidPasswordFields = true;
			return;
		}
		invalidEmailFields = false;
		emptyEmailFields = false;
		invalidPasswordFields = false;
		emptyPasswordFields = false;
		emptyUserNameFields = false;
		
		const body = { newPassword: newPassword1, email, operation : "password" };
		loading = true;
		const response = await fetch('/api/auth/update', {
			method: 'PUT',
			body: JSON.stringify(body)
		});
		loading = false;

	}



	//darkmode related functions


    function rgb2hex(rgb) {
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			function hex(x) {
				return ('0' + parseInt(x).toString(16)).slice(-2);
			}
			return '#' + hex(rgb[1]).toLocaleUpperCase() + hex(rgb[2]).toLocaleUpperCase() + hex(rgb[3]).toLocaleUpperCase();
	}

	function settingsMenuItemHoverIn(e) {
        const menuItem = e.target;
        const convertedHex = menuItem.style.backgroundColor.startsWith("rgb") ? rgb2hex(menuItem.style.backgroundColor) : menuItem.style.backgroundColor;
		if ($darkmode) {
			if (convertedHex !== menuSelectedColor) {
				e.target.style.backgroundColor = darkMenuHoverActiveColor;
			}
		} else {
			if (convertedHex !== menuSelectedColor) {
				e.target.style.backgroundColor = lightMenuHoverActiveColor;
			}
		}
	}

	function settingsMenuItemHoverOut(e) {
		

		let menuItems = [misItem, pfpItem, actItem];
		for (let i = 0; i < menuItems.length; i++) {
			const menuItem = menuItems[i];
            const convertedHex = menuItem.style.backgroundColor.startsWith("rgb") ? rgb2hex(menuItem.style.backgroundColor) : menuItem.style.backgroundColor;
			if (convertedHex !== menuSelectedColor) {
				menuItem.style.backgroundColor = 'inherit';
			}
		}
	}
</script>

<div id="settings" style="background-color : {$darkmode ? darkBodyColor : lightModeColor}">
	<div class="gay">
		<div class="menus">
			<aside class="menu" style="background-color : {$darkmode ? darkCardColor : lightModeColor}">
				<p class="menu-label">General</p>
				<ul class="menu-list">
					<li>
						<a
							bind:this={misItem}
							on:mouseenter={settingsMenuItemHoverIn}
							on:mouseleave={settingsMenuItemHoverOut}
							on:click={toggleMis}
							href="#"
							style="color: {$darkmode ? 'white' : 'black'}"
							id="mis">Miscellaneous</a
						>
					</li>
				</ul>
				<p class="menu-label">Account/Authentication</p>
				<ul class="menu-list">
					<li>
						<a
							bind:this={pfpItem}
							on:mouseenter={settingsMenuItemHoverIn}
							on:mouseleave={settingsMenuItemHoverOut}
							on:click={togglePfp}
							style="color: {$darkmode ? 'white' : 'black'}"
							id="pfp">Profile picture</a
						>
					</li>
					<li>
						<a
							bind:this={actItem}
							on:mouseenter={settingsMenuItemHoverIn}
							on:mouseleave={settingsMenuItemHoverOut}
							on:click={toggleAct}
							style="color: {$darkmode ? 'white' : 'black'}"
							id="act">Manage account details</a
						>
					</li>
				</ul>
			</aside>
		</div>

		<div class="content">
			{#if mis}
				<div
					class="account-card"
					style="background-color : {$darkmode ? darkCardColor : lightModeColor}"
				>
					<h2 style="color: {$darkmode ? 'white' : 'black'}">Miscellaneous</h2>
					<hr />
					<div class="field">
						<div class="control">
							<h3 class="checkbox" style="color: {$darkmode ? 'white' : 'black'}">
								Automatically unblur NSFW photos
								<input type="checkbox" id="cb" />
							</h3>
						</div>
					</div>
				</div>
			{/if}

			{#if pfp}
				<div
					class="account-card"
					style="background-color : {$darkmode ? darkCardColor : lightModeColor}"
					in:slide
					out:slide
				>
					<h2 style="color: {$darkmode ? 'white' : 'black'}">CHANGE PROFILE PHOTO</h2>
					<hr />
					<div class="formflex" style="color: {$darkmode ? 'white' : 'black'}">
						<div class="file has-name is-boxed">
							<label class="file-label">
								<input
									bind:this={profileInput}
									class="file-input"
									on:change={consumeFile}
									type="file"
									accept="image/*"
									name="pfp"
								/>
								<span
									class="file-cta"
									style="background-color : {$darkmode ? darkCardColor : lightModeColor}"
								>
									<span class="file-icon">
										<i style="color : {$darkmode ? 'white' : 'black'}" class="fas fa-upload" />
									</span>
									<span style="color : {$darkmode ? 'white' : 'black'}" class="file-label"> Select your profile photo </span>
								</span>
								<span
									class="file-name"
									style="background-color : {$darkmode ? darkCardColor : lightModeColor}"
								>
									{fileName.length ? fileName : 'No file selected'}
								</span>
							</label>
						</div>
						<button class="button is-success">Upload Photo</button>
					</div>
					{#if previewImageURL.length}
						<figure in:slide out:slide>
							<img on:click={cancelProfileUpload} src={previewImageURL} />
							<figcaption>Click this preview image to cancel profile picture upload</figcaption>
						</figure>
					{/if}
				</div>
			{/if}
			{#if account_details}
				<div
					class="account-card"
					style="background-color : {$darkmode ? darkCardColor : lightModeColor}"
					in:slide
					out:slide
				>
					<h2 style="color: {$darkmode ? 'white' : 'black'}">CHANGE ACCOUNT SETTINGS</h2>
					<hr />
					<div class="field">
						<h3 style="color: {$darkmode ? 'white' : 'black'}">
							Change Username (Current username: {username})
						</h3>
						<div class="control has-icons-left has-icons-right">
							<input
								class="input"
								type="text"
								placeholder="Enter a new username"
								bind:value={newUsername}
							/>
							<span class="icon is-small is-left">
								<i class="fas fa-user" />
							</span>
						</div>
						{#if !loading}
							<div class="control">
								<button class="button is-success" on:click={registerUserName}>Change Username</button>
							</div>
						{/if}
                        {#if emptyUserNameFields}
					        <p in:slide out:slide={{ duration: 650 }} class="help is-danger">
						        Please fill out the Username field!
					        </p>
				        {/if}
					</div>

					<div class="field">
						<h3 style="color: {$darkmode ? 'white' : 'black'}">
							Change Email (Current email: {email})
						</h3>
						<div class="control has-icons-left has-icons-right">
							<input
								class="input"
								type="email"
								placeholder="Enter a new email"
								bind:value={newEmail}
								on:input={checkEmail}
							/>
							<span class="icon is-small is-left">
								<i class="fas fa-envelope" />
							</span>
						</div>
						{#if !isEmailValid && email.length}
							<p in:slide out:slide={{ duration: 650 }} class="help is-danger">
								Please enter a valid email format!
							</p>
						{/if}
						{#if !loading}
							<div class="control">
								<button class="button is-success" on:click={registerUserEmail}>Change email</button>
							</div>
						{/if}
                        {#if emptyEmailFields}
					        <p in:slide out:slide={{ duration: 650 }} class="help is-danger">
						        Email cannot be empty!
					        </p>
				        {/if}
				        {#if invalidEmailFields}
					        <p in:slide out:slide={{ duration: 650 }} class="help is-danger">
						        Please make sure email is valid!
                            </p>
				        {/if}
					</div>

					<div class="field">
						<h3 style="color: {$darkmode ? 'white' : 'black'}">Change Password</h3>
						<div class="control has-icons-left">
							<input
								class="input"
								type="password"
								placeholder="Enter a new password"
								bind:value={newPassword1}
								on:input={checkPassword}
							/>
							<span class="icon is-small is-left">
								<i class="fa-solid fa-lock" />
							</span>
						</div>
						<div class="control has-icons-left">
							<input
								class="input"
								type="password"
								placeholder="Confirm the new password"
								bind:value={newPassword2}
								on:input={checkPassword}
							/>
							<span class="icon is-small is-left">
								<i class="fa-solid fa-lock" />
							</span>
						</div>
                        {#if !ispassword1Good}
							<p in:slide out:slide={{ duration: 650 }} class="help is-danger">{passwordHint}</p>
						{/if}
						{#if newPassword1 != newPassword2}
							<p in:slide out:slide={{ duration: 650 }} class="help is-danger">
								Passwords do not match
							</p>
						{/if}
						{#if !loading}
							<div class="control">
								<button class="button is-success" on:click={registerUserPassword}
									>Change Password</button
								>
							</div>
						{/if}
                        {#if emptyPasswordFields}
					        <p in:slide out:slide={{ duration: 650 }} class="help is-danger">
						        Please fill out both the password fields!
					        </p>
				        {/if}
				        {#if invalidPasswordFields}
					        <p in:slide out:slide={{ duration: 650 }} class="help is-danger">
						        Please make sure passwords are valid!
					        </p>
				        {/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	#settings {
		min-height: 100vh;
		padding-bottom: 16px;
		transition : background-color 200ms ease-in-out;
	}

	.field {
		width: 90%;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
		margin-bottom: 10px;
		align-self: center;
	}

	h3 {
		font-size: 15px;
		overflow-wrap: break-word;
		display: inline-block;
	}

	.menu-label {
		margin-top: 5px;
		margin-bottom: 5px;
		margin-left: 15px;
		margin-right: 15px;
		font-weight: bold;
	}

	.menu {
		position: -webkit-sticky;
		position: fixed;
		align-self: flex-start;
		margin-top: 100px;
		margin-left: 20px;
		padding-top: 5px;
		padding-bottom: 5px;
		border: none;
	}

	.menus {
		width: 25%;
	}

	.content {
		margin-right: 5%;
		width: 70%;
	}

	a {
		text-decoration: none;
	}

	a:active {
		color: blue;
	}

	h2 {
		padding-top: 45px;
		padding-bottom: 20px;
	}

	@media only screen and (max-width: 1024px) {
		.menus {
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;
			align-self: center;
			width: 70%;
		}

		.menu {
			position: relative;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;
			align-self: center;
			align-self: flex-start;
			margin-top: 100px;
			margin-left: 20px;
			padding-top: 5px;
			padding-bottom: 5px;
			border: none;
		}

		.gay {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex-wrap: wrap;
			margin-bottom: 60px;
		}

		.content {
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;
			align-self: center;
			width: 70%;
		}
	}

	.gay {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-bottom: 60px;
	}

	.account-card {
		display: block;
		text-align: center;
		width: 100%;
		border-radius: 10px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 100px;
		transition: all 200ms ease-in-out;
		padding-bottom: 30px;
		background-color: white;
	}

	.formflex {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	input {
		margin: 10px;
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
		border-radius: 10px;
		outline: none;
		text-align: center;
		padding: 5px;
		transition: all 200ms ease-in-out;
	}

	input:focus {
		transform: scale(1.02);
	}

	button {
		position: relative;
		height: 35px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		align-self: center;
		margin-top: 5px;
		padding: 5px 5px;
		font-weight: 400;
		font-size: 12px;
		letter-spacing: 2px;
		color: #383736;
		border: 2px #383736 solid;
		border-radius: 4px;
		text-transform: uppercase;
		outline: 0;
		overflow: hidden;
		background: none;
		cursor: pointer;
		transition: 0.08s ease-in;
		-o-transition: 0.08s ease-in;
		-ms-transition: 0.08s ease-in;
		-moz-transition: 0.08s ease-in;
		-webkit-transition: 0.08s ease-in;
	}

	button:hover {
		color: whitesmoke;
	}

	button:before {
		content: '';
		position: absolute;
		background: #383736;
		bottom: 0;
		left: 0;
		right: 0;
		top: 100%;
		z-index: -1;
		-webkit-transition: top 0.09s ease-in;
	}

	button:hover:before {
		top: 0;
	}

	#cb {
		height: 25px;
		width: 25px;
		border-radius: 25px;
		border: 2px;
	}

	#cb:checked {
		-webkit-appearance: none;
		height: 25px;
		width: 25px;
		border-radius: 25px;
		background-color: #383736;
		background: url('https://res.cloudinary.com/yuliu/image/upload/c_scale,w_25/v1656225813/dexbooru/download_gjbkwy.png');
	}

	.file-cta {
		margin: 10px;
		border: none;
	}

	figcaption {
		margin-top: 5px;
	}

	img {
		width: 250px;
		height: 250px;
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-top: 15px;
		border-radius: 50%;
		transition: all 200ms ease-in-out;
	}

	img:hover {
		cursor: pointer;
		transform: scale(1.03);
	}

	.file {
		display: block;
		margin-top: 5px;
		margin-left: auto;
		margin-right: auto;
		height: 125px;
		margin-bottom: 10px;
	}

	.file-name {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-top: 2px;
		background-color: white;
		border: none;
	}
</style>
