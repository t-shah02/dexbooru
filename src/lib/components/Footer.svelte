<script lang="ts">
	const today = new Date();
	const year = today.getFullYear();

	export let user: object | undefined;
</script>

<footer>
	<nav>
		<a href="https://github.com/t-shah02/dexbooru_migrate" class="circle transparent">
			<i class="fa-brands fa-github" />
		</a>
		<!-- <a href="mailto:dexboorudev@gmail.com" class="circle transparent">
			<i class="fa-light fa-circle-envelope" />
		</a> -->

		{#if user}
			<div class="max" />
			<button data-ui="#upload-modal" class="square round extra primary">
				<i>add</i>
				<div class="upload-tooltip tooltip top">Make a post</div>
			</button>
		{/if}
	</nav>
</footer>

<style>
	.upload-tooltip {
		margin-right: 100px;
	}

	footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: rgb(67, 137, 249);
		color: white;
		font-size: 18px;
	}
</style>
