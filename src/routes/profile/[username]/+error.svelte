<script lang="ts">
	import { page } from '$app/stores';

	const errorMessage: string | undefined = $page.error?.message;
</script>

<h1>{errorMessage}</h1>

<style>
</style>
