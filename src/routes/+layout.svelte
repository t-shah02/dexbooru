<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import UploadModal from '$lib/components/UploadModal.svelte';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const myModal = new HystModal({
			linkAttributeName: 'data-hystmodal'
		});
	});

	const user = $page.data.user;
</script>

<Navbar {user} />
{#if user}
	<UploadModal />
{/if}
<slot />
<Footer />
