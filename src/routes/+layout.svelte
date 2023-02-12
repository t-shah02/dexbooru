<script lang="ts">
	import '$lib/assets/styles/tailwind.css';
	import 'flowbite/dist/flowbite.css';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import UploadModal from '$lib/components/UploadModal.svelte';

	import { page } from '$app/stores';

	const user: UserApp | undefined = $page.data.user;
</script>

<Navbar {user} />
<!-- {#if user}
	<UploadModal />
{/if} -->
<slot />
<Footer {user} />
