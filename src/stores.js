import {writable} from "svelte/store"
import { browser } from '$app/env';

let initialValue;


if (browser) {
    initialValue = JSON.parse(localStorage.getItem("darkmode"));
}
else {
    initialValue = false;
}


export const homePageQuery = writable("");
export const searchMatches = writable([]);
export const files = writable([]);
export const darkmode = writable(initialValue);

export const addedTags = writable(new Set());
export const addedArtist = writable("");
