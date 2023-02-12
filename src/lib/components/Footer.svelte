<script lang="ts">
	import appLogo from '$lib/assets/logo.ico';
	const today = new Date();
	const year = today.getFullYear();

	export let user: object | undefined;
</script>

<footer
	class="p-4 bg-white shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800"
>
	<span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
		{year} <a href="/" class="hover:underline">Dexbooru</a> | All Rights Reserved to Original Artists
		and Posters
	</span>
	<ul class="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
		<li>
			<a href="/about" class="mr-4 hover:underline md:mr-6 ">
				<i class="fa-brands fa-discord" />
			</a>
		</li>
		<li>
			<a href="https://github.com/t-shah02/dexbooru_migrate" class="mr-4 hover:underline md:mr-6">
				<i class="fa-brands fa-github" />
			</a>
		</li>
		<li>
			<a href="mailto:dexbooru@gmail.com" class="mr-4 hover:underline md:mr-6">
				<i class="fa-solid fa-envelope" />
			</a>
		</li>
	</ul>
</footer>

<style>
	footer {
		width: 100%;
		position: sticky;
		bottom: 0;
	}
</style>
