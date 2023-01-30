<script lang="ts">
	import '$lib/assets/styles/tailwind.css';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import UploadModal from '$lib/components/UploadModal.svelte';

	import { page } from '$app/stores';

	const user = $page.data.user;
</script>

<Navbar {user} />
{#if user}
	<UploadModal />
{/if}
<slot />
<Footer {user} />
