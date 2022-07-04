<script context="module">
	export function load({ error, status }) {
        
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script>

    import {darkmode} from "../stores.js";
    import {darkBodyColor, lightModeColor} from "../colors";
    import { slide } from "svelte/transition";

	export let title;

    const dexbooruMascotURL = "https://ik.imagekit.io/hhqleju8jy/assets/dexbooru_mascot_9vo6oPs4j.png";


</script>


<svelte:head>
    <title>404 - Page not found</title>
</svelte:head>

<div in:slide out:slide style="background-color : {$darkmode ? darkBodyColor : lightModeColor}" id="error">
    <h1 style="color : {$darkmode ? "white" : "black"}">{title}</h1>
    <a style="color : {$darkmode ? "white" : "black"}" href="/">Return to home</a>
    <br>
    <figure>
        <img alt="dexbooru mascot" src={dexbooruMascotURL}>
        <figcaption style="color : {$darkmode ? "white" : "black"}">Courtesy to: <a style="color : {$darkmode ? "white" : "black"}" href="https://picrew.me/">Picrew Character Creator</a></figcaption>
    </figure>
</div>


<style>

    #error {
        min-height : 100vh;
        padding-bottom: 20px;
        padding-top: 8px;
        transition : background-color 200ms ease-in-out;
        text-align: center;
    }

    a {
        text-align : center;    
    }
    
    img {
        margin-top : 25px;
        margin-bottom : 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

    }
 
    h1 { 
        margin-top : 100px;
    }
</style>