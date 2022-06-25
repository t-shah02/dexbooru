<script context="module">
	export async function load({session}) {
        if (session.authenticated) {
            return {status : 302, redirect : "/"}
        }
		return {};
	}
</script>

<script>
    import { goto } from '$app/navigation';
    import {slide} from 'svelte/transition';


    let email = "";
    let username = "";
    let password1 = "";
    let password2 = "";

    let isEmailValid = true;
    let ispassword1Good = true;
    let passwordHint = "";
    let emptyFields = false;
    let invalidFields = false;
    let duplicatedFields = false;

    let fileName = "";
    let previewImageURL = "";
    let pfpImageEncoding = "";
    
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

    function checkPassword() {
        const MIN_PASSWORD_LENGTH = 12;
        const lengthCheck = password1.length >= MIN_PASSWORD_LENGTH;
        const lowercaseCheck = password1.search("[a-z]+");
        const uppercaseCheck = password1.search("[A-Z]+");
        const numberCheck = password1.search("[0-9]+");
        const specialCharCheck = password1.search("[$&+,:;=?@#|'<>.^*()%!-]");

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
    

    function checkEmail() {
        let validator =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (validator.test(email)) {
            isEmailValid = true;
        }
        else {
            isEmailValid = false;
        }
    }
    
    async function registerUser() {
        if (password1 != password2) {
            return;
        }
        
        if (!isEmailValid || !ispassword1Good) {
            invalidFields = true;
            return;
        }
    
        if (!email.length || !password1.length || !password2.length || !username.length) {
            emptyFields = true;
            return;
        }
        
        invalidFields = false;
        emptyFields = false;
        
        

        const body = {email : email, password : password1, username : username, pfpImageEncoding : pfpImageEncoding};
        const data = {method : "POST", body : JSON.stringify(body)};
        const response = await fetch("api/auth/signup",data);
    
        if (response.status == 200) { 
            goto("/login?accountCreated=true");
        }
        else {
            duplicatedFields = true;
            await new Promise(r => setTimeout(r, 200));
            window.scrollTo(0, document.body.scrollHeight);
        }

    }

</script>


    <div class="signup-card" in:slide out:slide="{{duration:650}}">
        <h1>Register your account</h1>
        <hr>
        <label for="email">Enter your email</label>
        <input for="email" bind:value={email} placeholder="Email ✉" type="email" on:input={checkEmail}>
        {#if !isEmailValid && email.length}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Please enter a valid email format! </h1>
        {/if}
        <label for="username">Enter your username</label>
        <input for="username" bind:value={username} placeholder="Username 👤" type="text">
        <label for="profile-photo">Upload a profile photo (optional)</label>
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
        {#if previewImageURL.length}
            <figure in:slide out:slide>
                <img on:click={() => {previewImageURL = ""; fileName = ""; pfpImageEncoding = "";}}  src={previewImageURL}>
                <figcaption>Click this preview image to cancel profile picture upload</figcaption>
            </figure>
        {/if}
        <label for="password1"> Enter a strong password </label>
        <input for="password1" bind:value={password1} placeholder="Password 🔒" type="password" on:input={checkPassword}>
        {#if !ispassword1Good}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> {passwordHint} </h1>
        {/if}
        <label for="password2"> Confirm your password </label>
        <input for="password2" bind:value={password2} placeholder="Confirm Password 🔒" type="password">
        {#if password1 != password2}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> The passwords do not match! </h1>
        {/if}
        <button type="submit" on:click={registerUser}> Register </button>
        {#if emptyFields}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Please fill out both fields! </h1>
        {/if}
        {#if invalidFields}
            <h1 in:slide out:slide="{{duration:650}}" class="invalid-email"> Please ensure that both fields follow guidelines </h1>
        {/if}
    </div>
    



{#if duplicatedFields}
    <div in:slide out:slide class="error-card flash mt-3 flash-error" on:click={() => duplicatedFields = false}>   
        <!-- <%= octicon "stop" %> -->
        <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>
        An account with either the email: {email} or username: {username} already exists, please try again!
        <br>
        Click on this messsage box to close it!
    </div>
{/if}

<style>

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

    .error-card {
        display : block;
        margin-left: auto;
        margin-right : auto;
        text-align : center;
        margin-bottom : 100px;
        width : 50%;
    }

    .invalid-email {
        color : red;
        font-size : 10px;
        margin : 0;
    }

    label {
        margin-top : 10px;;
        display: inline-block;
        text-align: center;
    }

    button {
        position: relative; 
        height: 45px;
        width: 150px;
        margin-top : 25px;
        padding: 5px 5px;
        margin-bottom : 10px;
        font-weight: 700;
        font-size: 15px;
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

  
    .signup-card {
        display : block;
        text-align : center;
        background-color : #D0D0D0;
        width : 400px;
        border-radius : 10px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        margin-left : auto;
        margin-right : auto;
        margin-top : 75px;
        margin-bottom : 55px;
        transition : all 200ms ease-in-out;
        background-color: #734ae8;
        background-image: linear-gradient(315deg, #734ae8 0%, #89d4cf 74%);
    }

    .signup-card:hover {
        transform : scale(1.01);
    }

    h1 {
        font-size : 25px;
        padding-top : 15px;
        padding-bottom : 15px;
        margin-top : 20px;
    }

    input {
        display : block;
        margin-left : auto;
        margin-right : auto;
        margin-top : 20px;
        border-radius : 10px;
        outline : none;
        text-align : center;
        padding : 5px;
        transition : all 200ms ease-in-out;
        
        
    }
    
    input:focus {
        transform : scale(1.05);
    }
    
</style>