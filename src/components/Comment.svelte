<script>
    export let user;
    export let username;
    export let pfpURL = "https://ik.imagekit.io/hhqleju8jy/posts/3";
    export let text;
    let date = "bruh";
    import {lightCommentColor, darkCommentColor} from "../colors.js";
	import {darkmode} from "../stores.js";
</script>

<div class="card" style="background-color : {$darkmode ? darkCommentColor : lightCommentColor}">
    <div class="card-content">
        <div class="media">
            <div class="media-left">
                <figure class="image">
                    <img src={pfpURL} alt="Placeholder image">
                </figure>
            </div>
        </div>
        <div class="content" style="color: {$darkmode ? 'white' : 'black'}">
            <div class="media-content">
                <p class="title is-4" style="color: {$darkmode ? 'white' : 'black'}">John Smith</p>
                <p>{text}</p>
            </div>
            <div class="date-reply">
                <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                <!-- add reply button here -->
            </div>
        </div>
    </div>
    <!-- add view replies toggle here -->
</div>

<style>

    .card{
	    height: max-content;
        margin : 10px;
    }

    .image img {
        height : 100%;
        width : 150px;
            
        border-radius : 75px;
    }

    .media {
        width: 25%;
        margin-right: 5%;
    }

    .content {
        margin-left: 5%;
        width: 65%;
    }

    .media-content p {
        text-align: left;
    }

    .card-content {
        display: flex;
        justify-content: space-evently;
    }

    .content {
        display: flex;
        flex-direction: column;
    }

    p {
        overflow-wrap: break-word;
    }

    .date-reply {
        display: flex;
        align-items: center;
    }
    
</style>