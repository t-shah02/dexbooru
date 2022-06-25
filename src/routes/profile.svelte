<script context="module">
    export async function load({session}) {
        const auth = session.authenticated;
        if (auth) {
            const email = session.email;
            const username = session.username;
            const pfp = session.pfp;          
            const posts = JSON.parse(session.posts);
            const numPosts = posts.length;
            return {props : {email : email, username : username, pfp : pfp, numPosts : numPosts}};
        }
        return {status : 302, redirect : "/"}
    }
</script>


<script>
    import {slide} from "svelte/transition";

    export let email;
    export let username;
    export let pfp;
    export let numPosts;

</script>

<svelte:head>
  <title>Profile - {username}</title>
</svelte:head>

<h1 class="profile-title">Profile</h1>
<div in:slide out:slide class="card">
    <div class="image"> 
      <img src={pfp} alt="profile picture of {username}" width=10%>
    </div>
    <div class="card-content">
      <div class="media">
        
        <div class="media-content">
          <p class="title is-8">{username}</p>
          <p class="subtitle is-6">Email : {email}</p>
          <p class="subtitle is-6">Number of posts : {numPosts}</p>
        </div>
      </div>
  
    </div>
  </div>

<style>

    .profile-title {
        text-align : center;
        margin-top : 50px;
    }

    .image {
      width: 40%;
      margin-left: 2.5%;
      margin-right:2.5%;
    }

    img {
      width : 100px;
      height : 100px;
      margin-top : 10px;
      border-radius : 50%;
    }


    .card {
        text-align : center;
        display : flex;
        margin-left : auto;
        margin-right : auto;
        width : 50%;
        height : 25%;
        margin-top : 5px;
        margin-bottom : 100px;
        transition : transform 200ms ease-in-out;
    }

    .card:hover {
        transform : scale(1.02);
    }

</style>