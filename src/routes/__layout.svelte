<script context="module">
    export async function load({session,fetch}) {
        const response = await fetch('/api/tags');
        const tagJSON = await response.json();
        const tags = [];
        for (let i = 0; i < tagJSON.length; i++) {
            tags.push(tagJSON[i].name);
        }
        
        const auth = session.authenticated;
        if (auth) {
            const username = session.username;
            const email = session.email;
            return {props : {auth : auth, username : username,email : email, tags : tags}};
        }
        return {props : {auth: auth, tags : tags}};
    }
</script>

<script>

    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte"

    export let auth;
    export let username;
    export let email;    
    export let tags;

    

</script>


    <Navbar tags={tags} auth={auth} username={username} email={email}></Navbar>

    <slot>
    </slot>

    <Footer></Footer>

