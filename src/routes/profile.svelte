<script context="module">
    export async function load({session}) {
        const auth = session.authenticated;
        if (auth) {
            const email = session.email;
            const username = session.username;
            return {props : {email : email, username : username}};
        }
        return {status : 302, redirect : "/"}
    }
</script>


<script>
    export let email;
    export let username;

</script>


<h1 class="profile-title">Profile</h1>
<div class="card">
    <div class="card-content">
      <div class="media">
        
        <div class="media-content">
          <p class="title is-7">Email: {email}</p>
          <p class="subtitle is-6">Username: {username}</p>
        </div>
      </div>
  
      <div class="content">
        This is a sample of your profile.
      </div>
    </div>
  </div>

<style>

    .profile-title {
        text-align : center;
        padding : 20px;
    }
    .card {
        display : block;
        margin-left : auto;
        margin-right : auto;
        width : 25%;
        height : 25%;
        margin-top : 20px;
        transition : transform 200ms ease-in-out;
    }

    .card:hover {
        transform : scale(1.02);
    }

</style>