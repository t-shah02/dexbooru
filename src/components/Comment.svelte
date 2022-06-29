<script>
    export let user;
    export let username;
    export let pfpURL;
    let text = "yo";
    let date = "bruh";
    
</script>

<div class="comment">
    <div class="userInfo">
        <h3>{username}</h3>
        <div class="image">
			<img src={pfpURL} alt="pfp of {username}" width="10%" />
		</div>
    </div>
    <div class="content">
        <p class="commentText">{text}</p>
        <p class="date">{date}</p>
    </div>
</div>

<style>

    .comment {
        margin: 10px;
        display:flex;
        justify-content: space-between;
    }

    .content {
        margin-right: 2.5%;
        width: 70%;
    }
    .image {
		width: 90%;
		margin-left: 5%;
		margin-right: 5%;
		position: relative;
	}

    .userInfo {
        margin-left: 2.5%;
        width: 25%;
        margin-top: 5px;
        margin-bottom: 5px;
    }

	img {
		max-height: 75%;
		max-width: 75%;
		width: auto;
		height: auto;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		border-radius : 10px;
	}

    .commentText {
        font-size: 18px;
    }

    .date {
        font-size: 12px;
    }
    
</style>