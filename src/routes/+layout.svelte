<script lang="ts">
	import '$lib/assets/styles/tailwind.css';
	import 'flowbite/dist/flowbite.css';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { authenticatedUser } from '$lib/stores/userStores';

	import { page } from '$app/stores';

	if ($page.data.user) {
		authenticatedUser.set($page.data.user);
	}
</script>

<Navbar />
<slot />
<Footer />
