<script context="module">
    export async function load({session}) {
        const auth = session.authenticated;
        if (auth) {
            const username = session.username;
            const email = session.email;
            return {props : {auth : auth, username : username,email : email}};
        }
        return {props : {auth: auth}};
    }
</script>

<script>
    import { get } from "svelte/store";

    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte"

    export let auth;
    export let username;
    export let email;    

</script>



<Navbar auth={auth} username={username} email={email}></Navbar>

<slot>
</slot>

<Footer></Footer>


<style>
    
</style>