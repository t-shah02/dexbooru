<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.message);
</script>

<h1>{JSON.stringify(data)}</h1>
