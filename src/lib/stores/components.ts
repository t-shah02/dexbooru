import type { FooterData, NavbarData } from '$lib/interfaces/componentData';
import { writable } from 'svelte/store';

export const navbarData = writable<NavbarData>({
	width: 0,
	height: 0
});

export const footerData = writable<FooterData>({
	width: 0,
	height: 0
});
