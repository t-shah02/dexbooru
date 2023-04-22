<script lang="ts">
	import '$lib/assets/styles/tailwind.css';
	import 'flowbite/dist/flowbite.css';
	import 'flatpickr/dist/flatpickr.css';
	import { onMount } from 'svelte';
	import { Modal } from 'flowbite';
	import type { ModalOptions, ModalInterface } from 'flowbite';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { authenticatedUser } from '$lib/stores/userStores';
	import { searchModalController } from '$lib/stores/globalStores';

	import { page } from '$app/stores';
	import { footerData, navbarData } from '$lib/stores/components';

	if ($page.data.user) {
		authenticatedUser.set({ ...$page.data.user, postPage: 0 });
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

		const getDimensionsAndSetStore = () => {
			const navbar = document.querySelector('#dexbooru-navbar') as HTMLElement;
			const footer = document.querySelector('#dexbooru-footer') as HTMLElement;

			if (navbar && footer) {
				const wN = navbar.offsetWidth;
				const hN = navbar.offsetHeight;
				const wF = footer.offsetWidth;
				const hF = footer.offsetHeight;

				if (wN > 0 && hN > 0 && wF > 0 && hF > 0) {
					navbarData.set({
						width: wN,
						height: hN
					});

					footerData.set({
						width: wF,
						height: hF
					});
				}
			}
		};

		getDimensionsAndSetStore();

		window.addEventListener('resize', () => {
			getDimensionsAndSetStore();
		});
	});
</script>

<Navbar />
<slot />
<Footer />
