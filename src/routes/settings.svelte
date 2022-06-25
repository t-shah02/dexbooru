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
	import { slide} from 'svelte/transition';
	export let email;
	export let username;

	//menu state variables
	let mis = true;
	let pfp = false;
	let account_details = false;

	//user state variables
	let newEmail = "";
    let newUsername = "";
    let newPassword1 = "";
    let newPassword2 = "";

	let isEmailValid = true;
    let ispassword1Good = true;
    let passwordHint = "";
    let emptyEmailFields = false;
    let invalidEmailFields = false;
    let duplicatedFields = false;
	let emptyUserNameFields = false;
	let invalidPasswordFields = false;
	let emptyPasswordFields = false;

	let fileName = "";
    let previewImageURL = "";
    let pfpImageEncoding = "";
    
	//image files
    function getEncoding(file) {
        return new Promise((resolve,reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onloadend = () => {
                resolve(reader.result);
            }

            reader.onerror = reject;
        })
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
	function toggleMis() {
		mis = true;
		pfp = false;
		account_details = false;
	}

	function togglePfp() {
		mis = false;
		pfp = true;
		account_details = false;
	}

	function toggleAct() {
		mis = false;
		pfp = false;
		account_details = true;
	}

	//functions to check email and password
	function checkEmail() {
		console.log("hello world");
        let validator =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (validator.test(newEmail)) {
            isEmailValid = true;
        }
        else {
            isEmailValid = false;
        }
    }

	function checkPassword() {
        const MIN_PASSWORD_LENGTH = 12;
        const lengthCheck = newPassword1.length >= MIN_PASSWORD_LENGTH;
        const lowercaseCheck = newPassword1.search("[a-z]+");
        const uppercaseCheck = newPassword1.search("[A-Z]+");
        const numberCheck = newPassword1.search("[0-9]+");
        const specialCharCheck = newPassword1.search("[$&+,:;=?@#|'<>.^*()%!-]");

        const failedChecks = [];
        if (lowercaseCheck == -1) {
            failedChecks.push("Please include at least one lowercase character!");
        }
        if (uppercaseCheck == -1) {
            failedChecks.push("Please include at least one uppercase character!");
        }
        if (!lengthCheck) {
            failedChecks.push("Please ensure that password is at least 12 characters");
        }
        if (numberCheck == -1) {
            failedChecks.push("Please include at least one numerical character!");
        }
        if (specialCharCheck == -1) {
            failedChecks.push("Please include at least one special character! Ex: #,$,!,etc..");
        }
        
        if (failedChecks.length) {
            passwordHint = failedChecks.join(", ");
            ispassword1Good = false;
        }
        else {
            ispassword1Good = true;
        }
    }

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
	 }

	async function registerUserPassword() {

		if (newPassword1.length == 0 || newPassword2.length == 0) {
			emptyPasswordFields = true;
			return;
		}

		if (!ispassword1Good) {
			invalidPasswordFields = true;
			return;
		}
		invalidEmailFields = false;
        emptyEmailFields = false;
		invalidPasswordFields = false;
		emptyPasswordFields = false;
		emptyUserNameFields = false;
	}
</script>

<div class="gay">
		<aside class="menu">
			<p class="menu-label">General</p>
			<ul class="menu-list">
				<li><a class:is-active={mis} on:click={toggleMis} href="#">Miscellaneous</a></li>
			</ul>
			<p class="menu-label">Account/Authentication</p>
			<ul class="menu-list">
				<li><a class:is-active={pfp} on:click={togglePfp}>Profile picture</a></li>
				<li>
					<a class:is-active={account_details} on:click={toggleAct}>Manage account details</a>
				</li>
			</ul>
		</aside>
		{#if mis}
		<div class="menu-settings-container">
			<div class="settings-container">
				<h1>hello world</h1>
				<h1>hello world</h1>
				<h1>hello world</h1>
				<h1>hello world</h1>
				<h1>hello world</h1>
				<h1>hello world</h1>
				<h1>hello world</h1>
				<h1>hello world</h1>
				<h1>hello world</h1>
			</div>
		</div>
	{/if}
	{#if pfp}
	<div class="account-card" in:slide out:slide>
		<h1>CHANGE PROFILE PHOTO</h1>
		<hr>
		<div class="formflex">
		<div class="file has-name is-boxed">
            <label class="file-label">
              <input class="file-input" on:change={consumeFile} type="file" accept="image/*" name="pfp">
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">
                  Select your profile photo
                </span>
              </span>
              <span class="file-name">
                {fileName.length ? fileName : "No file selected"}
              </span>
            </label>
          </div>
		  <button type="submit"> Change Photo </button>
		</div>
        {#if previewImageURL.length}
            <figure in:slide out:slide>
                <img on:click={() => {previewImageURL = ""; fileName = ""; pfpImageEncoding = "";}}  src={previewImageURL}>
                <figcaption>Click this preview image to cancel profile picture upload</figcaption>
            </figure>
        {/if}
	</div>
	{/if}
	{#if account_details}
	<div class="account-card" in:slide out:slide>
		<h1>CHANGE ACCOUNT SETTINGS</h1>
		<hr>
		<div class="formflex">
			<h2>CURRENT USERNAME:</h2>
			<p class="unpw">{username}</p>
			<input type="text" class="change-username" placeholder="new username" bind:value={newUsername}>
			<button type="submit" on:click={registerUserName}> Change Email </button>
		</div>
		<div class="formflex">
			<h2>CURRENT EMAIL: </h2>
			<p class="unpw">{email}</p>
			<input type="text" class="change-email" placeholder="new email" bind:value={newEmail} on:input={checkEmail}>
			{#if !isEmailValid && newEmail.length}
            	<h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Please enter a valid email format! </h1>
        	{/if}
			<button type="submit" on:click={registerUserEmail}> Change Email </button>
		</div>
		<div class="formflex">
			<h2>CHANGE PASSWORD</h2>
			<input type="password" class="change-password" placeholder="new password" bind:value={newPassword1} on:input={checkPassword}>
			{#if !ispassword1Good}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> {passwordHint} </h1>
        	{/if}
			<input type="password" class="confirm-password" placeholder="confirm new password" bind:value={newPassword2} on:input={checkPassword}>
			{#if newPassword1 != newPassword2}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> The passwords do not match! </h1>
        	{/if}
			<button type="submit" on:click={registerUserPassword}> Change Password </button>
		</div>
		{#if emptyEmailFields}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Email cannot be empty! </h1>
        {/if}
        {#if invalidEmailFields}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Please make sure email is valid! </h1>
        {/if}
		{#if emptyUserNameFields}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Please fill out the Username field! </h1>
        {/if}
		{#if emptyPasswordFields}
			<h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Please fill out both the password fields! </h1>
		{/if}
		{#if invalidPasswordFields}
			<h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Please make sure passwords are valid! </h1>
		{/if}
	</div>
	{/if}
</div>

<style>
	.menu {
		position: -webkit-sticky;
		position: fixed;
		align-self: flex-start;
		margin-top: 100px;
		margin-left: 20px;
		border: none;
	}

	a {
		text-decoration: none;
	}

	a:active {
		color: blue;
	}

	.menu-settings-container {
		display: flex;
		width: 100%;
	}

	.settings-container {
		margin-left: auto;
		margin-right: auto;
	}

	h1 {
		margin: 50px;
		text-align: center;
	}

	.gay {
		display:flex;
		justify-content: space-between;
		overflow-x: auto;
		margin-bottom: 60px;
	}

	.account-card {
        display : block;
        text-align : center;
        background-color : #D0D0D0;
        width : 400px;
        border-radius : 10px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        margin-left : auto;
        margin-right : auto;
        margin-top : 100px;
        transition : all 200ms ease-in-out;
        background-color: #734ae8;
		padding-bottom: 30px;
    }
	.formflex {
		display:flex;
		flex-direction: column;
		justify-content: center;
	}

	input {
		margin: 10px;
        display : block;
        margin-left : auto;
        margin-right : auto;
        margin-top : 10px;
        border-radius : 10px;
        outline : none;
        text-align : center;
        padding : 5px;
        transition : all 200ms ease-in-out;
    
    }
    
    input:focus {
        transform : scale(1.05);
    }

	button {
        position: relative;
        height: 35px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		align-self: center;
        margin-top : 5px;
        padding: 5px 5px;
        font-weight: 400;
        font-size: 12px;
        letter-spacing: 2px;
        color: #383736;
        border: 2px #383736 solid;
        border-radius: 4px;
        text-transform: uppercase;
        outline: 0;
        overflow:hidden;
        background: none;
        cursor: pointer;
        transition:         0.08s ease-in;
        -o-transition:      0.08s ease-in;
        -ms-transition:     0.08s ease-in;
        -moz-transition:    0.08s ease-in;
        -webkit-transition: 0.08s ease-in;
        }

    button:hover {
        color: whitesmoke;
        }

    button:before {
        content: "";
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

	.invalid-email {
        color : red;
        font-size : 10px;
        margin : 0;
    }

	.unpw {
		font-size: 18px;
	}

	.file-cta {
        margin : 10px;
        
    }

    figcaption {
        margin-top : 5px;
    }

    img {
        width : 250px;
        height : 250px;
        display : block;
        margin-left : auto;
        margin-right : auto;
        margin-top : 15px;
        border-radius: 50%;
        transition : all 200ms ease-in-out;
    }

    img:hover {
        cursor : pointer;
        transform : scale(1.03);
    }

    .file {
        display : block;
        margin-top : 5px;
        margin-left : auto;
        margin-right : auto;
        height : 125px;
        margin-bottom : 10px;
    }

    .file-name {
        display : block;
        margin-left : auto;
        margin-right : auto;
        margin-top : 2px;
        background-color : white;
    }
</style>
