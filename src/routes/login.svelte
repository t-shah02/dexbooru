<script context="module">
    export async function load({session}) {
        const auth = session.authenticated;
        if (auth) {
            return {status : 302, redirect : "/"}
        }
        return {};
    }
</script>

<script>
    
    import { slide} from 'svelte/transition';
    import {darkmode} from "../stores";
    import { darkCardColor, darkBodyColor, lightModeColor} from "../colors.js";

    let email = "";
    let password = "";
    let loginErrrorMsg = "";

    let isEmailValid = true;
    let emptyFields = false;

    function checkEmail() {
        let validator = /^\S+@\S+$/;
        if (validator.test(email)) {
            isEmailValid = true;
        }
        else {
            isEmailValid = false;
        }
    }


    async function sendLoginData() {
        if (!email.length || !password.length) {
            emptyFields = true;
            return;
        }        
        
        checkEmail();
        if (isEmailValid) {
            emptyFields = false;
            const requestBody = {email : email, password : password}
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(requestBody)
            });
            
            if (response.status == 200) {
                window.location.replace("/");
            }
            else if (response.status == 404) {
                loginErrrorMsg = "There is no account assoicated with the given email, please try again!";
            }
            
            else if (response.status == 403) {
                loginErrrorMsg = "Incorrect password! Please try again!";
            }
            

        }
        
    }
    
</script>


<div id="login" style="background-color : {$darkmode ? darkBodyColor : lightModeColor}">
<div class="login-card" in:slide out:slide="{{duration:650}}" style="background-color : {$darkmode ? darkCardColor : lightModeColor}">
    <h1 style="color: {$darkmode ? "white" : "black"}">Log in</h1>
    <div class="field">
        <label class="label" style="color: {$darkmode ? "white" : "black"}">Email</label>
        <div class="control has-icons-left">
          <input class="input" type="email" placeholder="example@hotmail.com" bind:value={email} on:input={checkEmail}>
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        {#if !isEmailValid && email.length}
            <p in:slide out:slide="{{duration:650}}" class="help is-danger"> Please enter a valid email format! </p>
        {/if}
      </div>
      
      <div class="field">
        <label class="label" style="color: {$darkmode ? "white" : "black"}">Password</label>
        <div class="control has-icons-left">
          <input class="input" type="password" bind:value={password}>
          <span class="icon is-small is-left">
            <i class="fa-solid fa-lock"></i>
        </span>
        </div>
        {#if emptyFields}
            <p in:slide out:slide="{{duration:650}}" class="help is-danger"> Please fill out both fields! </p>
        {/if}
      </div>
      <button type="submit" class="button is-success" on:click={sendLoginData}>Log in</button>
    <h1 class="signup-heading"><a href="/signup" class="button is-danger">Need an account? Sign up here</a></h1>
</div>    
</div>

{#if loginErrrorMsg.length}
        <div in:slide out:slide class="error-card flash mt-3 flash-error" on:click={() => loginErrrorMsg = ""}>   
            <!-- <%= octicon "stop" %> -->
            <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>
            {loginErrrorMsg}
            <br>
            Click on this messsage box to close it!
        </div>
{/if}

<style>
    #login {
        min-height : 100vh;
        padding-bottom: 16px;
        padding-top: 8px;
        transition : background-color 200ms ease-in-out;
    }

    .field {
        width: 90%;
        left: 0;
        right: 0;
        margin-left:auto;
        margin-right: auto;
        margin-top: 10px;
        margin-bottom: 10px;
        align-self:center;
    }
    .error-card {
        display : block;
        margin-left: auto;
        margin-right : auto;
        text-align : center;
        margin-bottom : 100px;
        width : 50%;
    }

    .error-card:hover {
        cursor : pointer;
    }

    .signup-heading {
        padding-top : 10px;
        padding-bottom : 20px;
    }

    
    a {
        font-size : 12px;
        text-align : center;
        text-decoration: none;
        border : 1px solid black;
        border-radius : 5px;
        padding : 5px;
        transition : all 150ms ease-in-out;
        
    }

    a:visited {
        color : black;
    }

    a:hover {
        background-color : blue;
        color : white;
    }


    button {
        position: relative;
        height: 45px;
        width: 150px;
        margin-top : 10px;
        margin-bottom: 10px;
        padding: 5px 5px;
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
        z-index: 1;
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

    .login-card {
        display : block;
        text-align : center;
        background-color : white;
        width : 70%;
        border-radius : 10px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        margin-left : auto;
        margin-right : auto;
        margin-top : 100px;
        transition : all 200ms ease-in-out;
    }

    @media only screen and (max-size: 780px) {
        .login-card {
        display : block;
        text-align : center;
        background-color : white;
        width : 90%;
        border-radius : 10px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        margin-left : auto;
        margin-right : auto;
        margin-top : 100px;
        transition : all 200ms ease-in-out;
    }
    }

    .login-card:hover {
        transform : scale(1.01);
    }

    label {
        border : none;
        font-size: 15px;
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
        margin-top : 5px;
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