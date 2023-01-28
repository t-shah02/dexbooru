<script lang="ts">
	import { page } from '$app/stores';
	import notFoundMascot from '$lib/assets/page_not_found_mascot.png';

	const pathName = $page.url.pathname;
</script>

<div class="no-posts-container">
	<h1 class="page-not-found-message center-align">
		Broke the magnifying glass.... Nothing found at {pathName}
	</h1>
	<a data-sveltekit-reload class="button transparent border" href="/"> Go Home </a>
	<img src={notFoundMascot} alt="no posts found mascot" />
</div>

<style>
	.page-not-found-message {
		font-size: 20px;
	}

	img {
		width: 350px;
		height: 350px;
		display: block;
		margin-left: auto;
		margin-right: auto;
	}


    a {
        margin-left : auto;
        margin-right : auto;
        margin-bottom : 20px;
    }

	.no-posts-container {
        margin-top : 65px;
        display: flex;
        flex-direction : column;
        align-items: center;
        justify-content: center;
	}
</style>
