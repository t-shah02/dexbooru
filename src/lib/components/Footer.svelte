<script lang="ts">
	const today = new Date();
	const year = today.getFullYear();
</script>

<footer class="footer">
	Dexbooru @ {year}
	<br />
	All image rights reserved by their respective creators and/or artists.
</footer>

<style>
	.footer {
		padding : 20px;
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: rgb(67, 137, 249);
		color: white;
		font-size: 18px;
		text-align : center;
		
	}
</style>
