<script lang="ts">
	import '$lib/assets/styles/tailwind.css';
	import 'flowbite/dist/flowbite.css';
	import 'flatpickr/dist/flatpickr.css';
	import { onMount } from 'svelte';
	import { Modal } from 'flowbite';
	import type { ModalOptions, ModalInterface } from 'flowbite';
	import SearchModal from '$lib/components/search/SearchModal.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { authenticatedUser } from '$lib/stores/userStores';
	import { searchModalController } from '$lib/stores/globalStores';

	import { page } from '$app/stores';

	if ($page.data.user) {
		authenticatedUser.set($page.data.user);
	}

	let modal: ModalInterface;

	onMount(() => {
		const modalElement = document.querySelector('#search-modal') as HTMLElement;

		const modalOptions: ModalOptions = {
			placement: 'center',
			backdrop: 'dynamic',
			backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
			closable: true
		};

		modal = new Modal(modalElement, modalOptions);
		searchModalController.set(modal);

		document.addEventListener('keydown', (event) => {
			if (event.ctrlKey && event.key === 'k' && $searchModalController) {
				$searchModalController.show();
			}
		});
	});
</script>

<Navbar />
<slot />
<Footer />
<SearchModal />
